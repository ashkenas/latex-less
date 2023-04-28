import { BSON } from "bson";
import { ObjectId, WithId } from "mongodb";

export type NamedText = {
  name: string,
  text: string
};

export type Project = {
  name: string,
  lastEdited: number,
  equations: WithId<NamedText>[],
  responses: WithId<NamedText>[]
};

export interface User extends BSON.Document {
  _id?: ObjectId,
  firebaseId: String,
  equations: WithId<NamedText>[],
  projects: WithId<Project>[]
};
