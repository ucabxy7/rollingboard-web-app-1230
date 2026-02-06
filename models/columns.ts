import { z } from "zod";

// UI/Form schema - for user's input
export const columnFormSchema = z.object({
  name: z.string().min(1, "Column name is required"),
});

export type ColumnFormData = z.infer<typeof columnFormSchema>;

// domain model(frontend) - for system (storage)
export interface Column {
  id: string;
  name: string;
  order: number;
}
