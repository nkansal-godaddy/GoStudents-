import jwt from "jsonwebtoken";

export type DecodedSSO = {
  customerId: string;
  shopperId?: string;
  email?: string;
  accountName?: string;
  exp?: number;
  iat?: number;
};

export function decodeSSOJwt(token: string): DecodedSSO | null {
  try {
    // Decode payload only (no signature verification needed for test env)
    const decoded = jwt.decode(token) as Record<string, any> | null;
    if (!decoded) return null;

    return {
      customerId: decoded.sub || decoded.customerId,
      shopperId: decoded.shopperId || decoded.sid || undefined,
      email: decoded.email || decoded.accountName || undefined,
      accountName: decoded.accountName,
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch {
    return null;
  }
}
