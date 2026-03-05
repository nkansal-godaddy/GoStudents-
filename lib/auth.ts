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
  const authValue = "eyJhbGciOiAiUlMyNTYiLCAia2lkIjogInRmNC10bkJNYncifQ.eyJqdGkiOiAiRWthSi10WXc2cGJhUU9kNGphRHlaQSIsICJpYXQiOiAxNzcyNjkyNDQ0LCAiYXV0aCI6ICJiYXNpYyIsICJ0eXAiOiAiY2VydCIsICJmYWN0b3JzIjogeyJwX2NlcnQiOiAxNzcyNjkyNDQ0fSwgInNiaiI6IHsibyI6ICJHb0RhZGR5IEluYy4iLCAib3UiOiAiR29EYWRkeSBJbmMuIiwgImNuIjogInFhLnRlc3QtZ29kYWRkeS5jb20ifX0.OLB-qyYG3OF0uujIPaG8KBbQ09qJXAUnNgtYBr-6ngWUqIaJNicl-oijzZtrcK_K5m7kSHIM89Ryo8abQCClxYrL8LpXZmIFzistFAcTtbRTO_W1-BfAgArkIRJi_LkXgD9-Y2QFDoPGu7OVJ725qkmlImEIvVld_tmTzFqsGeF437omOVQAaBIggSSLyE5VntYDyhDvCL0Ee3evRoeXHjiSDENqfnj_MkCK97rpujSTuYFRjjbXBy4Sv7gKJ404auC1n07YUIyujLCbLBfPPO015hyWu6QaohXi6ZGELJB-gRsJEIhHnNvX9X2GxVo7ioGa9ClTfhkOYkB8JrFCPw";
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
