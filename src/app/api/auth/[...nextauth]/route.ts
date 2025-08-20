export const config = {
  runtime: "node",
};

import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
