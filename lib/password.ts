export function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[\W_]/.test(pw)) s++;
  return s;
}

export const passwordRequirements = [
  { text: "At least 8 characters", check: (pw: string) => pw.length >= 8 },
  { text: "Upper and lowercase letters", check: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { text: "At least one number", check: (pw: string) => /\d/.test(pw) },
  { text: "At least one symbol", check: (pw: string) => /[\W_]/.test(pw) },
];
