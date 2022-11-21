import { getSession } from "next-auth/react";
import { connectToDB } from "../../../../util/connect";

import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send("signin required");
  }
  const mongodbClient = await connectToDB();

  const db = mongodbClient.db();

  const id = new ObjectId(req.query.id);

  const order = await db.collection("orders").findOne({ _id: id });

  mongodbClient.close();

  res.status(201).json({ order });
};

export default handler;
