// src/lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Specify the endpoint URL explicitly with basePath
const BASE_PATH = "/1isto9-perfumery";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: `${BASE_PATH}/api/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: `${BASE_PATH}/api/uploadthing`,
});

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: `${BASE_PATH}/api/uploadthing`,
});