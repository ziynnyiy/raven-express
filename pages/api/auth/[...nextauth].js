import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await mongooseConnect();
        const { email, password } = credentials;

        const user = await User.findOne({ userEmail: email });
        if (!user) throw Error("信箱或密碼錯誤 !");

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw Error("信箱或密碼錯誤 !");

        return {
          userEmail: user.userEmail,
          id: user._id,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_FRONT_ID,
      clientSecret: process.env.FACEBOOK_FRONT_SECRET,
    }),
  ],
  callbacks: {
    jwt(params) {
      if (params.user?.id) {
        params.token.id = params.user.id;
      }
      // return final token
      return params.token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
