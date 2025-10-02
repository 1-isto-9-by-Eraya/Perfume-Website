// // app/providers.tsx
 "use client";

 import { SessionProvider } from "next-auth/react";

 const BASE_PATH = "/1isto9-perfumery";

 export default function Providers({ children }: { children: React.ReactNode }) {
   console.log("SessionProvider basePath:", "/1isto9-perfumery/api/auth");
   return (
     <SessionProvider basePath={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/api/auth`}>
{/* <SessionProvider basePath="/1isto9-perfumery/api/auth"> */}
       {children}
     </SessionProvider>
   );
 }