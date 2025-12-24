"use server";

import { Cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function clearAuthAndRedirect() {
  // 1. Remove the secure cookie on the server
  Cookies().delete("kniholap_auth_token");

  // 2. Redirect to the login page (crucial for clearing the cache)
  redirect("/auth");
}