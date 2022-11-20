import { connectToDB } from "../../util/connect";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send("signin required");
  }

  const { user } = session;

  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const {} = data;

  const mongodbClient = await connectToDB();

  const db = mongodbClient.db();

  const order = await db
    .collection("orders")
    .insertOne({ ...req.body, user: user.email });

  mongodbClient.close();

  res.status(201).send(order);
}
