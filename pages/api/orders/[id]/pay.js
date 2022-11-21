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

  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: "order is already paid" });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };

    const paidOrder = await db
      .collection("orders")
      .updateOne({ _id: id }, { $set: order });

    mongodbClient.close();
    res.send({ message: "order paid successfully", order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Error: order not found" });
  }
};

export default handler;
