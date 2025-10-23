// Utility functions for working with cookies

export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function getCustomerId(): string | null {
  return getCookieValue('customer_id');
}

export function getShopperId(): string | null {
  return getCookieValue('shopper_id');
}

export function getUserEmail(): string | null {
  return getCookieValue('user_email');
}

export function getSchoolId(): string | null {
  return getCookieValue('school_id');
}

export function isUserAuthenticated(): boolean {
  const customerId = getCustomerId();
  const shopperId = getShopperId();
  return !!(customerId && shopperId);
}

export function setCookie(name: string, value: string, days: number = 6): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
}

export function clearAllCookies(): void {
  if (typeof document === 'undefined') return;
  
  const cookies = ['customer_id', 'shopper_id', 'user_email', 'school_id', 'auth_jomax'];
  cookies.forEach(cookie => {
    document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
}
