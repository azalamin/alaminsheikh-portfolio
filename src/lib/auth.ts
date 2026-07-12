import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { ac, adminRole, editorRole } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      mustChangePassword: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles: { admin: adminRole, editor: editorRole },
      defaultRole: "editor",
      adminRoles: ["admin"],
    }),
    nextCookies(), // must be the last plugin
  ],
});
