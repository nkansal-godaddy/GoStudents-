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

/*export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("godaddy_sso")?.value;
  return decodeMockToken(token);
}*/

export async function getAuthJwt(): Promise<string | null> {
  //const cookieStore = await cookies();
  //return cookieStore.get("auth_idp")?.value || null;
  const authValue = "eyJhbGciOiAiUlMyNTYiLCAia2lkIjogIkN3elhURmE4REEifQ.eyJqdGkiOiAiOTBGOHZrWkxvWmZpNjJBVlB2djJDQSIsICJpYXQiOiAxNzYxMjUyNjgwLCAiYXV0aCI6ICJiYXNpYyIsICJ0eXAiOiAiY2VydCIsICJmYWN0b3JzIjogeyJwX2NlcnQiOiAxNzYxMjUyNjgwfSwgInNiaiI6IHsibyI6ICJHb0RhZGR5IEluYy4iLCAib3UiOiAiR29EYWRkeSBJbmMuIiwgImNuIjogInFhLnRlc3QtZ29kYWRkeS5jb20ifSwgImV4cCI6IDE3NjEzMzkwODB9.JahRuJNmMPJzV-JT7hP2Y40o4Wobmt2rmFua7FBCbihO16woEwKLpVzLzAU7Odfr8FTPsEBaoLXtr-fRbCTVERDmEyoLoR3Zbfz6dSYlned9ACmby1hIvJrgrPUjR8JZ9iLOcrhVMYCCJKmChxuFOnSqYdWvOhAHUjxpfujcNnkI9MorTeTQn1aBqyMS7ptwKxvoxrQR7dadEeS6vpbPaZ5hcnLloVdmStSuginE5aGf9gDlk32_oFdqPi_fqaDHu-cGn8LrS30A0s4VP71yDPqg_xpNq5o7-moXIx8acUE0wD309UuSv4487rJdPVeNTSYeVNyStp1RlId6VQaGxw";
  return authValue;

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
