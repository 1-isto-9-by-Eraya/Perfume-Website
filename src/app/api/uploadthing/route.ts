// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Route handler for the UploadThing app router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
