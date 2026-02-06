// API DTO level.(difference from form level ui and domain model)
export interface CreateColumnInput {
  name: string;
  order: number;
}

export interface UpdateColumnInput {
  name: string;
}

export interface ReorderColumnInput {
  id: string;
  order: number;
}
