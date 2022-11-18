import { MongoClient } from "mongodb";

export async function connectToDB() {
  const client = await MongoClient.connect(
    "mongodb+srv://newuser:febTeJGJtzEWpDie@cluster0.p4imx.mongodb.net/Users?retryWrites=true&w=majority"
  );
  return client;
}
