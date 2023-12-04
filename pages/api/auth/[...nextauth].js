import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_FRONT_ID,
      clientSecret: process.env.FACEBOOK_FRONT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
};

export default (req, res) => NextAuth(req, res, authOptions);
