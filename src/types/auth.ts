// types/auth.ts - You can delete this entire file now
// Or keep it simple if you need it elsewhere:
import type { UserRole } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}