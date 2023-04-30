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
