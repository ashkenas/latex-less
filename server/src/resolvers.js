import { GraphQLError } from "graphql";
import { AuthContext } from ".";
import { QueryResolvers, User } from "./typings/graphql";
import { Resolvers } from "./typings/graphql";
import { getUser, stringify } from "./data";

const authorize = (user, ctx) => {
  if (user.firebaseId === ctx.uid) return;

  throw new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
      http: { status: 403 }
    }
  });
};

const userProjects = async (_, _args, ctx) => {
  const user = await getUser(ctx.uid);
  return user.projects.map(stringify);
};

const userEquations = async (_, _args, ctx) => {
  const user = await getUser(ctx.uid);
  return user.equations.map(stringify);
};

const project = async (_, { id }, ctx) => {
  const user = await getUser(ctx.uid);
  const projects = user.projects.map(stringify);
  const project = projects.find(e => e._id === id);
  if (!project) {
    throw new GraphQLError('Project not found.', {
      extensions: {
        code: 'NOTFOUND',
        http: { status: 404 }
      }
    });
  }
  return project;
};

const equation = async (_, { id }, ctx) => {
  const user = await getUser(ctx.uid);
  const equations = user.equations.map(stringify);
  const equation = equations.find(e => e._id === id);
  if (!equation) {
    throw new GraphQLError('Equation not found.', {
      extensions: {
        code: 'NOTFOUND',
        http: { status: 404 }
      }
    });
  }
  return equation;
};

// const response = async (_, { id }, ctx) => {
//   return null;
// };

const Resolvers = {
  Query: {
    userProjects: userProjects,
    userEquations: userEquations,
    project: project,
    equation: equation,
    // response: response
  }
};

export default Resolvers;
