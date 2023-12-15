import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {}, // prevent Nextauth from creating default UI !
      async authorize(credentials, req) {
        try {
          await mongooseConnect();

          if (!credentials.email || !credentials.password) {
            return null;
          }

          // 信箱驗證
          const user = await User.findOne({ userEmail: credentials.email });
          if (!user) {
            return null;
          }

          // 密碼驗證
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordMatch) {
            return null;
          }

          return { id: user.id, email: user.userEmail };
        } catch (error) {
          return Promise.reject(new Error("發生未知錯誤 !"));
        }
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
    async jwt({ token, user, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      console.log("jwt callback", { token, user, session });
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      console.log("session callback", { session, token, user });
      return session;
    },
  },
};

export default NextAuth(authOptions);
