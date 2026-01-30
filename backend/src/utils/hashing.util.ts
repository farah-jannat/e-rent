import { password } from "bun";

export const hashPassword = async (plainTextPassword: string) => {
  const cost = 10; // Adjust cost factor as needed (higher = slower but more secure)
  const hashedPassword = await password.hash(plainTextPassword, {
    algorithm: "bcrypt",
    cost,
  });
  return hashedPassword;
};
