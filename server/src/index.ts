import { config } from "dotenv";
config();
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from "fs";
import resolvers from "./resolvers";
import { GraphQLError } from "graphql";

export interface AuthContext extends BaseContext {
  uid?: String;
};

const app = initializeApp({
  credential: applicationDefault()
});

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const server = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers
});

await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const token = req.headers.authorization || '';

    try {
      const { uid } = await getAuth(app).verifyIdToken(token, true);
      return { uid };
    } catch (e) {
      console.error(e);
      throw new GraphQLError('Unauthenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 }
        }
      });
    }
  }
});
