import { hash, compare } from "bcryptjs";

export async function hashedPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValidPassword = await compare(password, hashedPassword);
  return isValidPassword;
}
