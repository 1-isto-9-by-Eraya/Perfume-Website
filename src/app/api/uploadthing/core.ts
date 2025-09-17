// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
      const session = await getServerSession(authOptions);
      const email = session?.user?.email ?? null;

      if (!session || !isAllowedEmail(email)) {
        throw new Error("UNAUTHORIZED");
      }

      return { userId: session.user!.id as string };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return whatever you want to your client here
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
      const session = await getServerSession(authOptions);
      const email = session?.user?.email ?? null;

      if (!session || !isAllowedEmail(email)) {
        throw new Error("UNAUTHORIZED");
      }

      // NOTE: Only return serializable metadata you need later.
      // Anything returned here is available as `metadata` in onUploadComplete.
      return { userId: session.user!.id as string };
    })
    // ❌ onUploadBegin is NOT available on server; use client hooks for that.
    .onUploadComplete(async ({ metadata, file }) => {
      // Post-process or persist as needed
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
