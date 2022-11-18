import { connectToDB } from "../../../util/connect";
import { hashedPassword } from "../../../util/hashedPassword";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const { username, email, password } = data;

  if (!email || !password) {
    res.status(422).json({ message: "Invalid Data.." });
  }
  const mongodbClient = await connectToDB();

  const db = mongodbClient.db();

  const existingUser = await db.collection("users").findOne({ email: email });

  if (existingUser) {
    res.status(422).json({ message: "User Already Exists..Please Login" });
    mongodbClient.close();
    return;
  }

  const bcryptedPassword = await hashedPassword(password);

  await db.collection("users").insertOne({
    username: username,
    email: email,
    password: bcryptedPassword,
  });

  mongodbClient.close();

  res.status(201).json({ message: "Created User" });
}
