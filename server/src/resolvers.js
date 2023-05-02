import { GraphQLError } from "graphql";
import { addProjectEquation, addProjectResponse, getUser, getUserProject, newEquation, newProject, removeProjectEquation, removeProjectResponse, removeUserEquation, removeUserProject, stringify, updateEquation, updateProject } from "./data";
import { getUserEquation } from "./data";

const userProjects = async (_, _args, ctx) => {
  const user = await getUser(ctx.uid);
  return user.projects.map(stringify);
};

const userEquations = async (_, _args, ctx) => {
  const user = await getUser(ctx.uid);
  return user.equations.map(stringify);
};

const project = async (_, { id }, ctx) => {
  const res = await getUserProject(ctx.uid, id);
  return stringify(res);
};

const equation = async (_, { id }, ctx) => {
  const res = await getUserEquation(ctx.uid, id);
  return stringify(res);
};

const resolve = async (prom) => {
  return stringify(await prom);
};

const Resolvers = {
  Query: {
    userProjects: userProjects,
    userEquations: userEquations,
    project: project,
    equation: equation
  },
  Mutation: {
    newProject: (_, __, ctx) => resolve(newProject(ctx.uid)),
    newEquation: (_, __, ctx) => resolve(newEquation(ctx.uid)),
    updateProject: (_, args, ctx) => resolve(updateProject(ctx.uid, args.id, args.name, args.equations, args.responses)),
    updateEquation: (_, args, ctx) => resolve(updateEquation(ctx.uid, args.id, args.name, args.text)),
    addProjectEquation: (_, args, ctx) => resolve(addProjectEquation(ctx.uid, args.id)),
    addProjectResponse: (_, args, ctx) => resolve(addProjectResponse(ctx.uid, args.id)),
    removeProjectEquation: (_, args, ctx) => resolve(removeProjectEquation(ctx.uid, args.pid, args.id)),
    removeProjectResponse: (_, args, ctx) => resolve(removeProjectResponse(ctx.uid, args.pid, args.id)),
    removeUserEquation: (_, args, ctx) => resolve(removeUserEquation(ctx.uid, args.id)),
    removeUserProject: (_, args, ctx) => resolve(removeUserProject(ctx.uid, args.id))
  }
};

export default Resolvers;
