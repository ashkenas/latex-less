import { GraphQLError } from "graphql";
import { addProjectEquation, addProjectResponse, getUser, getUserProject, newProject, removeProjectEquation, removeProjectResponse, removeUserEquation, stringify, updateEquation } from "./data";
import { getUserEquation } from "./data";

const authorize = (user, ctx) => {
  if (user === ctx.uid) return;

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
  // const user = await getUser(ctx.uid);
  // const projects = user.projects.map(stringify);
  // const project = projects.find(e => e._id === id);
  // if (!project) {
  //   throw new GraphQLError('Project not found.', {
  //     extensions: {
  //       code: 'NOTFOUND',
  //       http: { status: 404 }
  //     }
  //   });
  // }
  // return project;
  const [user, res] = getUserProject(id);
  authorize(user, ctx);
  return stringify(res);
};

const equation = async (_, { id }, ctx) => {
  // const user = await getUser(ctx.uid);
  // const equations = user.equations.map(stringify);
  // const equation = equations.find(e => e._id === id);
  // if (!equation) {
  //   throw new GraphQLError('Equation not found.', {
  //     extensions: {
  //       code: 'NOTFOUND',
  //       http: { status: 404 }
  //     }
  //   });
  // }
  // return equation;
  const [user, res] = getUserEquation(id);
  authorize(user, ctx);
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
    // updateProject,
    updateEquation: (_, args, ctx) => resolve(updateEquation(ctx.uid, args.id, args.name, args.text)),
    addProjectEquation: (_, args, ctx) => resolve(addProjectEquation(ctx.uid, args.id)),
    addProjectResponse: (_, args, ctx) => resolve(addProjectResponse(ctx.uid, args.id)),
    removeProjectEquation: (_, args, ctx) => resolve(removeProjectEquation(ctx.uid, args.pid, args.id)),
    removeProjectResponse: (_, args, ctx) => resolve(removeProjectResponse(ctx.uid, args.pid, args.id)),
    removeUserEquation: (_, args, ctx) => resolve(removeUserEquation(ctx.uid, args.id))
  }
};

export default Resolvers;
