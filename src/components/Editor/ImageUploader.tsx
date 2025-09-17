// "use client";

// import { useRef, useState } from "react";
// import { useUploadThing } from "@/lib/uploadthing";

// interface ImageUploaderProps {
//   label: string;
//   onUploaded: (url: string) => void;
// }

// export default function ImageUploader({ label, onUploaded }: ImageUploaderProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { startUpload } = useUploadThing("imageUploader", {
//     onClientUploadComplete: (res) => {
//       // res is an array, get the first uploaded file
//       if (res && res[0]) {
//         // Use ufsUrl if available (v9+), fallback to url for older versions
//         const fileUrl = res[0].ufsUrl || res[0].url;
//         onUploaded(fileUrl);
//       }
//       setIsUploading(false);
//     },
//     onUploadError: (error) => {
//       console.error("Upload error:", error);
//       alert(`Upload failed: ${error.message}`);
//       setIsUploading(false);
//     },
//     onUploadBegin: () => {
//       setIsUploading(true);
//     },
//   });

//   const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }

//     if (file.size > 4 * 1024 * 1024) { // 4MB limit to match your UploadThing config
//       alert('File size must be less than 4MB');
//       return;
//     }

//     try {
//       await startUpload([file]);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Failed to upload image. Please try again.');
//       setIsUploading(false);
//     } finally {
//       // Clear the file input so the same file can be selected again if needed
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileSelect}
//         className="hidden"
//       />
//       <button
//         type="button"
//         onClick={handleButtonClick}
//         disabled={isUploading}
//         className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
//       >
//         {isUploading ? (
//           <>
//             <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <span>Uploading...</span>
//           </>
//         ) : (
//           <div className="flex py-1.5 items-center gap-1">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span>{label}</span>
//           </div>
//         )}
//       </button>
//     </div>
//   );
// }