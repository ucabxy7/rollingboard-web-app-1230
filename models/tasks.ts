import { z } from "zod";

// form ui schema （columnId is injected as input parameter in api calling, not in form)
export const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Task description is required"),
  assignedToId: z
    .string()
    .uuid({ message: "Invalid assignedTo id" })
    .optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

// domain model
export interface Task {
  id: string;
  name: string;
  description: string;
  // columnId: string;
  assignedToId?: string;
}
// task api respense returned from backend.
export interface TaskApiResponse {
  id: string;
  name: string;
  description: string;
  assignedTo: {
    id: string;
    username: string;
    email: string;
  } | null;
}
// UI task (adapt from task api response)
export interface DialogUITask extends Task {
  assignedToName?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
}
