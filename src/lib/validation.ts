import { z } from "zod";


const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value ? value : null));

export const documentTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters.")
    .max(12, "Code must be 12 characters or fewer.")
    .regex(
      /^[A-Z0-9-]+$/,
      "Use uppercase letters, numbers, or hyphens only.",
    ),
  description: optionalText(300),
});

export const documentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(160, "Title must be 160 characters or fewer."),
  document_type_id: z.string().uuid("Select a document type."),
  description: optionalText(1000),
});

export const idSchema = z.string().uuid("Invalid record identifier.");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
