import { MongoClient } from "mongodb";

let _connection;
let _db;

export const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(process.env.MONGO_CONN_STRING);
    _db = _connection.db(process.env.MONGO_DB_NAME);
  }

  return _db;
};

export const closeConnection = async () => {
  await _connection.close();
  _connection = undefined;
  _db = undefined;
};
