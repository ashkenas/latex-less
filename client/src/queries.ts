import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
query GetProjects {
  userProjects {
    _id
    lastEdited
    name
  }
}
`;

export const NEW_PROJECT = gql`
mutation NewProject {
  newProject {
    _id
  }
}`;

export const DEL_PROJECT = gql`
mutation DelProject($id: ID!) {
  removeProject(id: $id) {
    _id
  }
}`;
