import { config } from "dotenv";
config();
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from "fs";
import resolvers from "./resolvers";

interface AuthContext {
  uid?: String;
}

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
    const user = await getAuth(app).verifyIdToken(token);
    return user.uid;
  }
});
