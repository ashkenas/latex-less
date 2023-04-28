import { User } from "../typings/mongo";
import { dbConnection } from "./connection";
import { Collection } from "mongodb";

const memoCollection = (collection: string) => {
  let _col: Collection<User>;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = db.collection<User>(collection);
    }

    return _col;
  };
};

export const users = memoCollection('users');