import { GraphQLError } from "graphql";
import { AuthContext } from ".";
import { QueryResolvers, User } from "./typings/graphql";
import { Resolvers } from "./typings/graphql";

type Q = QueryResolvers<AuthContext>;

const authorize = (user: User, ctx: AuthContext) => {
  if (user.firebaseId === ctx.uid) return;

  throw new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
      http: { status: 403 }
    }
  });
};

const userProjects: Q['userProjects'] = async (_, { id }, ctx) => {
  return [];
};

const userEquations: Q['userEquations'] = async (_, { id }, ctx) => {
  return [];
};

const project: Q['project'] = async (_, { id }, ctx) => {
  return null;
};

const equation: Q['equation'] = async (_, { id }, ctx) => {
  return null;
};

const response: Q['response'] = async (_, { id }, ctx) => {
  return null;
};

const Resolvers: Resolvers<AuthContext> = {
  Query: {
    userProjects: userProjects,
    userEquations: userEquations,
    project: project,
    equation: equation,
    response: response
  }
};

export default Resolvers;
