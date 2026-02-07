// API DTO level.(difference from form level ui and domain model)
export interface CreateColumnInput {
  name: string;
  order: number;
}

export interface UpdateColumnInput {
  name: string;
}

export interface SwapColumnInput {
  ids: [string, string];
}
// tasks
export interface CreateTaskInput {
  name: string;
  description: string;
  columnId: string;
  assignedToId?: string;
}
export interface UpdateTaskInput {
  name?: string;
  description?: string;
  columnId?: string;
  assignedToId?: string;
}
