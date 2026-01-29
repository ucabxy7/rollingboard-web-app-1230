import z from "zod";

export type Project = {
  id: string;
  name: string;
  description: string;
};

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
