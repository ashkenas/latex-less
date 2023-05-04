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
  const token = req.headers.authorization || '';

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
expressApp.use('/graphql', cors(), expressMiddleware(server, {
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

expressApp.post('/export', async (req, res) => {
  if (!req.firebaseId)
    return res.status(401).send('Unauthenticated.');
  
  let pid = req.body.id;
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

  res.sendFile(await projectToFile(project));
});

expressApp.get('*', (_, res) => res.status(404).send('This website is not public.'))

httpServer.listen({ port: 4000 }, () => {
  console.log('Express w/ Apollo online at http://localhost:4000/');
});

