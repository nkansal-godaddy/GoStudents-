import { cookies } from "next/headers";
import { decodeSSOJwt, DecodedSSO } from "./jwt";

export type AuthUser = { email: string; schoolId: string };

export function makeMockToken(user: AuthUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function decodeMockToken(token: string | undefined): AuthUser | null {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
}

export function getAuthUser(): AuthUser | null {
  const token = cookies().get("godaddy_sso")?.value;
  return decodeMockToken(token);
}

export async function getAuthJwt(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_jomax")?.value || null;
}

export async function getDecodedUser(): Promise<DecodedSSO | null> {
  const token = await getAuthJwt();
  if (!token) return null;
  return decodeSSOJwt(token);
}
