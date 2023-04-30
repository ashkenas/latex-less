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
