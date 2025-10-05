// lib/auth-actions.ts
"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  deleteSession,
  verifyCredentials,
  hashPassword,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { isAllowedEmail } from "@/lib/acl";
import { getRoleByEmail, DEFAULT_USER_ROLE } from "@/lib/roles";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = signInSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  if (!isAllowedEmail(email)) {
    return {
      error: "You are not authorized to access this application",
    };
  }

  const user = await verifyCredentials(email, password);

  if (!user) {
    return {
      error: "Invalid email or password",
    };
  }

  await createSession(user.id);

  redirect("/dashboard"); // ✅ Remove BASE_PATH - Next.js adds it
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const result = signUpSchema.safeParse({ email, password, name });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  if (!isAllowedEmail(email)) {
    return {
      error: "You are not authorized to access this application",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return {
      error: "User with this email already exists",
    };
  }

  const hashedPassword = await hashPassword(password);
  const role = getRoleByEmail(email);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role || DEFAULT_USER_ROLE,
    },
  });

  await createSession(user.id);

  redirect("/dashboard"); // ✅ Remove BASE_PATH
}

export async function signOut() {
  await deleteSession();
  redirect("/"); // ✅ Remove BASE_PATH
}