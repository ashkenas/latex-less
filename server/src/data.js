import { GraphQLError } from "graphql";
import { users } from "./mongo/collections.js";
import { ObjectId } from "mongodb";

const notFound = (msg) => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'NOTFOUND',
      http: { status: 404 }
    }
  });
};

export const stringify = (document) => {
  if (typeof document !== 'object') return document;
  const stringDoc = {};
  for (const key in document) {
    if (key === '_id')
      stringDoc[key] = document[key].toString();
    else if (typeof document[key] === 'object') {
      if (Array.isArray(document[key]))
        stringDoc[key] = document[key].map(stringify);
      else stringDoc[key] = stringify(document[key]);
    } else stringDoc[key] = document[key];
  }
  return stringDoc;
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

const getFromUserArray = async (array, uid, id, name) => {
  const col = await users();
  const res = await col.findOne({
    firebaseId: uid,
    [array]: {
      $elemMatch: {
        _id: new ObjectId(id)
      }
    }
  }, {
    projection: {
      firebaseId: 1,
      [`${array}.$`]: 1
    }
  });

  if (!res) notFound(`${name} not found.`);

  return res[array][0];
}

export const getUserEquation = async (uid, id) => {
  return await getFromUserArray('equations', uid, id, 'Equation');
};

export const getUserProject = async (uid, id) => {
  return await getFromUserArray('projects', uid, id, 'Project');
};

const getFromProjectArray = async (array, pid, id, name) => {
  const col = await users();
  const res = await col.findOne({
    projects: {
      $elemMatch: {
        _id: new ObjectId(pid),
        [`${array}._id`]: new ObjectId(id)
      }
    }
  }, {
    projection: {
      'projects.$': 1
    }
  });

  if (!res) notFound(`${name} not found.`);

  return res.projects[0][array].find(e => e._id.toString() === id);
};

export const getProjectEquation = async (pid, id) => {
  return await getFromProjectArray('equations', pid, id, 'Equation');
};

export const getProjectResponse = async (pid, id) => {
  return await getFromProjectArray('responses', pid, id, 'Response');
};

export const newProject = async (uid) => {
  const col = await users();
  const pid = new ObjectId();
  const res = await col.updateOne({
    firebaseId: uid
  }, {
    $push: {
      projects: {
        _id: pid,
        name: 'New Project',
        left: '',
        right: '',
        lastEdited: Date.now(),
        equations: (await getUser(uid)).equations,
        responses: []
      }
    }
  });

  if (!res.acknowledged || !res.modifiedCount)
    throw new GraphQLError('Failed to create new project.');

  return await getUserProject(uid, pid.toString())
};

export const newEquation = async (uid) => {
  const col = await users();
  const eid = new ObjectId();
  const res = await col.updateOne({
    firebaseId: uid
  }, {
    $push: {
      equations: {
        _id: eid,
        name: 'New Equation',
        text: 'y=x^2+5'
      }
    }
  });

  if (!res.acknowledged || !res.modifiedCount)
    throw new GraphQLError('Failed to create new equation.');

  return await getUserEquation(uid, eid.toString())
};

export const updateEquation = async (uid, id, name, text) => {
  const col = await users();
  const res = await col.updateOne({
    firebaseId: uid,
    equations: {
      $elemMatch: {
        _id: new ObjectId(id)
      }
    }
  }, {
    $set: {
      "equations.$": {
        _id: new ObjectId(id),
        name: name,
        text: text
      }
    }
  });

  if (!res.acknowledged)
    throw new GraphQLError('Failed to update equation.');
  
  return await getUserEquation(uid, id);
};

const addToProjectArray = async (uid, pid, array, name, text) => {
  const col = await users();
  const id = new ObjectId();
  const res = await col.updateOne({
    firebaseId: uid,
    projects: {
      $elemMatch: {
        _id: new ObjectId(pid)
      }
    }
  }, {
    $set: {
      "projects.$.lastEdited": Date.now(),
    },
    $push: {
      [`projects.$.${array}`]: {
        _id: id,
        name: name || "New",
        text: text || ""
      }
    }
  });

  const t = array.substring(0, array.length - 1);

  if (!res.acknowledged)
    throw new GraphQLError(`Failed to add new ${t}.`);

  return await getFromProjectArray(array, pid, id.toString(), t[0].toUpperCase() + t.substring(1));
};

export const addProjectEquation = async (uid, pid, name, text) => {
  return await addToProjectArray(
    uid,
    pid,
    'equations',
    name || 'New Equation',
    text|| 'y=x^2+5'
  );
};

export const addProjectResponse = async (uid, pid) => {
  return await addToProjectArray(uid, pid, 'responses', 'New Response', 'The answer is c.');
};

const removeFromProjectArray = async (uid, pid, id, array) => {
  const col = await users();
  const res = await col.updateOne({
    firebaseId: uid,
    projects: {
      $elemMatch: {
        _id: new ObjectId(pid)
      }
    }
  }, {
    $set: {
      "projects.$.lastEdited": Date.now(),
    },
    $pull: {
      [`projects.$.${array}`]: {
        _id: new ObjectId(id)
      }
    }
  });

  const t = array.substring(0, array.length - 1);

  if (!res.acknowledged)
    throw new GraphQLError(`Failed to remove ${t}.`);

  return await getUserProject(uid, pid);
};

export const removeProjectEquation = async (uid, pid, id) => {
  return await removeFromProjectArray(uid, pid, id, 'equations');
};

export const removeProjectResponse = async (uid, pid, id) => {
  return await removeFromProjectArray(uid, pid, id, 'responses');
};

export const removeFromUserArray = async (uid, id, array) => {
  const col = await users();
  const res = await col.updateOne({
    firebaseId: uid
  }, {
    $pull: {
      [array]: {
        _id: new ObjectId(id)
      }
    }
  });

  if (!res.acknowledged)
    throw new GraphQLError(`Failed to delete user ${array.substring(0, array.length - 1)}.`);

  return await getUser(uid);
};

export const removeUserEquation = async (uid, id) => {
  return await removeFromUserArray(uid, id, 'equations');
};

export const removeUserProject = async (uid, id) => {
  return await removeFromUserArray(uid, id, 'projects');
};

const updateInProjectArray = async (uid, pid, id, array, name, text) => {
  const col = await users();
  const res = await col.updateOne({
    firebaseId: uid,
    projects: {
      $elemMatch: {
        _id: new ObjectId(pid)
      }
    }
  }, {
    $set: {
      "projects.$.lastEdited": Date.now(),
      [`projects.$.${array}.$[e]`]: {
        _id: new ObjectId(id),
        name: name,
        text: text
      }
    }
  }, {
    arrayFilters: [ { "e._id": new ObjectId(id) } ]
  });

  if (!res.acknowledged)
    throw new GraphQLError('Failed to update project.');
};

export const updateProject = async (uid, id, name, left, right, equations, responses) => {
  const col = await users();
  name = name && name.trim();
  left = left && left.trim();
  right = right && right.trim();
  if (name || left || right) {
    const fields = {};
    if (name)
      fields["projects.$.name"] = name;
    if (left)
      fields["projects.$.left"] = left;
    if (right)
      fields["projects.$.right"] = right;
    const res = await col.updateOne({
      firebaseId: uid,
      projects: {
        $elemMatch: {
          _id: new ObjectId(id)
        }
      }
    }, {
      $set: {
        "projects.$.lastEdited": Date.now(),
        ...fields
      }
    });
  
    if (!res.acknowledged)
      throw new GraphQLError('Failed to update project.');
  }
  
  for (const e of (equations || [])) {
    await updateInProjectArray(uid, id, e._id, "equations", e.name, e.text);
  }
  
  for (const e of (responses || [])) {
    await updateInProjectArray(uid, id, e._id, "responses", e.name, e.text);
  }

  return await getUserProject(uid, id);
};
