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

export const GET_EQUATIONS = gql`
query GetEquations {
  userEquations {
    _id
    name
    text
  }
}
`;

export const NEW_PROJECT = gql`
mutation NewProject($name: String, $text: String) {
  newProject(name: $name, text: $text) {
    _id
  }
}`;

export const NEW_EQUATION = gql`
mutation NewEquation {
  newEquation {
    _id
  }
}`;

export const DEL_PROJECT = gql`
mutation DelProject($id: ID!) {
  removeUserProject(id: $id) {
    _id
  }
}`;

export const DEL_EQUATION = gql`
mutation DelEquation($id: ID!) {
  removeUserEquation(id: $id) {
    _id
  }
}`;

export const UPDATE_EQUATION = gql`
mutation UpdateEquation($id: ID!, $name: String!, $text: String!) {
  updateEquation(id: $id, name: $name, text: $text) {
    _id
  }
}`

export const GET_PROJECT = gql`
query GetProject($id: ID!) {
  project(id: $id) {
    _id
    name
    lastEdited
    equations {
      _id
      name
      text
    }
    responses {
      _id
      name
      text
    }
  }
}
`;

export const UPDATE_PROJECT = gql`
mutation UpdateProject($id: ID!, $name: String, $equations: [NamedTextInput], $responses: [NamedTextInput] ) {
  updateProject(id: $id, name: $name, equations: $equations, responses: $responses) {
    _id
    name
    lastEdited
    equations {
      _id
      name
      text
    }
    responses {
      _id
      name
      text
    }
  }
}
`;
