import { cookies } from "next/headers";

export type AuthUser = { 
  email: string; 
  schoolId: string; 
  customerId: string;
  shopperId: string;
};

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

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("godaddy_sso")?.value;
  return decodeMockToken(token);
}

export async function getAuthJwt(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_jomax")?.value || null;
}

export async function getDecodedUser(): Promise<{ customerId: string; shopperId: string; email: string } | null> {
  const token = await getAuthJwt();
  if (!token) return null;
  
  try {
    // Decode JWT payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return {
      customerId: payload.sub || payload.customerId,
      shopperId: payload.shopperId,
      email: payload.email || payload.accountName,
    };
  } catch {
    return null;
  }
}
