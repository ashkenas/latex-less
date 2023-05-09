import { config } from "dotenv";
config();
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { readFileSync } from "fs";
import resolvers from "./resolvers.js";
import { GraphQLError } from "graphql";
import express from "express";
import cors from "cors";
import http from "http"
import { getUserProject, stringify } from "./data.js";
import { projectToFile } from "./latex.js";
import path from "path";
import { unlink } from "fs/promises";

const firebaseApp = initializeApp({
  credential: applicationDefault()
});

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const expressApp = express();
const httpServer = http.createServer(expressApp);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

expressApp.use(express.json());
expressApp.use(async (req, res, next) => {
  const token = req.headers.authorization || req.query.token || '';

  if (token) {
    try {
      const { uid } = await getAuth(firebaseApp).verifyIdToken(token, true);
      req.firebaseId = uid;
      return next();
    } catch (e) {
      console.error(e);
    }
  }

  next();
});
expressApp.use('/api/graphql', cors(), expressMiddleware(server, {
  context: async ({ req }) => {
    if (req.firebaseId)
      return { uid: req.firebaseId };

    throw new GraphQLError('Unauthenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }
      }
    });
  }
}));

expressApp.get('/api/export/:id', async (req, res) => {
  if (!req.firebaseId)
    return res.status(401).send('Unauthenticated.');
  
  let pid = req.params.id;
  if (!pid || typeof pid !== 'string' || !(pid = pid.trim()))
    return res.status(400).send('Invalid id.');

  let project;
  try {
    project = stringify(await getUserProject(req.firebaseId, pid));
  } catch (e) {
    if (e instanceof GraphQLError && e.extensions.code === 'NOTFOUND') {
      return res.status(404).send('Project not found.');
    } else {
      console.error(e);
      return res.status(500).send('Internal server error.');
    }
  }

  try {
    const relativePath = await projectToFile(project);
    const absolutePath = path.resolve(relativePath);
    return res.sendFile(absolutePath, async (err) => {
      if (err) {
        console.error(err);
        if (!res.headersSent) return res.status(500).send('Internal server error.');
      } else {
        try {
          const noExt = absolutePath.split('.').slice(0, -1).join('.');
          const auxFile = `${noExt}.aux`;
          const logFile = `${noExt}.log`;
          await unlink(absolutePath);
          await unlink(logFile);
          await unlink(auxFile);
        } catch (e) {
          console.error(e);
        }
      }
    });
  } catch (e) {
    console.error(e);
    if (!res.headersSent)
      return res.status(500).send('Internal server error.');
  }
});

expressApp.get('*', (_, res) => res.status(404).send('This website is not public.'))

httpServer.listen({ port: 4000 }, () => {
  console.log('Express w/ Apollo online at http://localhost:4000/');
});

