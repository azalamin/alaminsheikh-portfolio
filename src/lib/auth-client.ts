import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRole, editorRole } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: { admin: adminRole, editor: editorRole },
    }),
  ],
});
