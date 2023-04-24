import { Resolvers } from "./typings/graphql";

const userProjects = async ({ id }) => {
  return [];
};

const userEquations = async ({ id }) => {
  return [];
};

const project = async ({ id }) => {
  return null;
};

const equation = async ({ id }) => {
  return null;
};

const response = async ({ id }) => {
  return null;
};

const Resolvers: Resolvers = {
  Query: {
    userProjects: (_, args, ctx) => userProjects.bind(ctx, args),
    userEquations: (_, args, ctx) => userEquations.bind(ctx, args),
    project: (_, args, ctx) => project.bind(ctx, args),
    equation: (_, args, ctx) => equation.bind(ctx, args),
    response: (_, args, ctx) => response.bind(ctx, args),
  }
};

export default Resolvers;
