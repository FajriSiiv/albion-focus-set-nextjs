// // auth.ts
// import type { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         if (
//           credentials?.email === "demo@example.com" &&
//           credentials?.password === "password123"
//         ) {
//           return { id: "1", name: "Demo User", email: "demo@example.com" };
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
// };