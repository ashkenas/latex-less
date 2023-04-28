import { GraphQLError } from "graphql";
import { users } from "./mongo/collections";

export const stringify = (document) => {
  return { ...document, _id: document._id.toString() };
};

export const getUser = async (uid) => {
  const col = await users();
  const res = await col.findOne({ firebaseId: uid });

  if (!res) {
    const res = await col.insertOne({
      firebaseId: uid,
      projects: [],
      equations: []
    });

    if (!res.acknowledged)
      throw new GraphQLError('Could not create new user.');

    return await getUser(uid);
  } else {
    return res;
  }
};
