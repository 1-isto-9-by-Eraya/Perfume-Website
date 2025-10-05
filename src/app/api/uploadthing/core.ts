// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@/lib/auth-utils";
import { isAllowedEmail } from "@/lib/acl";

const f = createUploadthing();

export const ourFileRouter = {
  // Images
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = await getSession();
      const email = session?.email ?? null;

      if (!session || !isAllowedEmail(email)) {
        throw new Error("UNAUTHORIZED");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }),

  // Videos
  videoUploader: f({
    video: {
      maxFileSize: "128MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getSession();
      const email = session?.email ?? null;

      if (!session || !isAllowedEmail(email)) {
        throw new Error("UNAUTHORIZED");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Video uploaded by ${metadata.userId}: ${file.name} (${file.size} bytes)`);
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;