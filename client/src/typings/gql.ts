export type NamedText = {
  _id: string,
  name: string,
  text: string
};

export type Project = {
  _id: string,
  firebaseId: string,
  lastEdited: number,
  equations: NamedText[],
  responses: NamedText[]
};
