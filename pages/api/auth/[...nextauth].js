import NextAuth from "next-auth/next";
import { connectToDB } from "../../../util/connect";
import { verifyPassword } from "../../../util/hashedPassword";
import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const mongodbClient = await connectToDB();

        const db = mongodbClient.db();

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user) {
          mongodbClient.close();
          throw new Error("User Not Found!");
        }

        const result = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!result) {
          console.log("here..2");
          mongodbClient.close();
          throw new Error("Password Incorrect, Couldnt log you in");
        }

        console.log("here..");

        mongodbClient.close();
        return { email: user.email };
      },
    }),
  ],
});
