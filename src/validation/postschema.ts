import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  body: z.string().min(1, "Body is required"),
});

export type PostFormType = z.infer<typeof postFormSchema>;
