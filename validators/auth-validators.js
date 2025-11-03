import z from "zod";


const userNameSchema = z.string()
  .trim()
  .min(3, "Name must be at least 3 characters long")
  .max(100, "Name must have no more than 100 characters")

const passwordSchema = z.string()
  .trim()
  .min(6, "Password should have at least 6 characters")
  .max(100, "Password cannot have more than 100 characters")

export const userRegisterSchema = z.object({
  username: userNameSchema,

  email: z.string()
    .trim()
    .email("Invalid email address"),

  password: passwordSchema
});

export const changeProfileSchema = z.object({
  username: userNameSchema
})

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})