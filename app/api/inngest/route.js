import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
   syncUserCreation,
   syncUserUpdation,
   syncUserDeletion
  ],
});

// ✅ Correct for App Router

// import { serve } from "inngest/next";
// import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// export const { GET, POST, PUT } = serve("quickcart-next", [
//   syncUserCreation,
//   syncUserUpdation,
//   syncUserDeletion
// ]);
