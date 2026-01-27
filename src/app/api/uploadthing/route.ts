// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const BASE_PATH = "/1isto9-perfumery";

// Export route handlers with correct callback URL
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Set the correct callback URL with basePath
    callbackUrl: `${BASE_PATH}/api/uploadthing`,
  },
});