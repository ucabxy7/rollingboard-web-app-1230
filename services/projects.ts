import { ProjectFormData } from "@/models/projects";
import { Column, ColumnFormData } from "@/models/columns";
import { Task, TaskFormData } from "@/models/tasks";
import { getCommonHeaders, handleApiResponse } from "./base";
import { Project } from "@/models/projects";
import { Pagination } from "@/models/pagination";
import { Membership } from "@/models/memberships";
import { TaskApiResponse } from "@/models/tasks";

import {
  CreateColumnInput,
  UpdateColumnInput,
  SwapColumnInput,
  CreateTaskInput,
  UpdateTaskInput,
} from "./dto";
import { promises } from "dns";
import { json } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createProject = async (project: ProjectFormData) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects`;

  const response = await handleApiResponse<{ project: Project }>(
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(project),
    }),
  );
  return response!.project;
};

export const updateProject = async (
  projectId: string,
  project: ProjectFormData,
) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}`;

  const response = await handleApiResponse<{ project: Project }>(
    await fetch(url, {
      headers,
      method: "PATCH",
      body: JSON.stringify(project),
    }),
  );
  return response!.project;
};

export const fetchProjects = async (page: number, pageSize: number) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects?page=${page}&pageSize=${pageSize}`;

  const response = await handleApiResponse<{
    projects: Project[];
    pagination: Pagination;
  }>(await fetch(url, { headers }));
  return { projects: response!.projects, pagination: response!.pagination };
};

export const deleteProject = async (projectId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}`;

  const response = await handleApiResponse<void>(
    await fetch(url, { headers, method: "DELETE" }),
  );
  return response;
};

export const fetchProjectMemberships = async (projectId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}/memberships`;

  const response = await handleApiResponse<{ memberships: Membership[] }>(
    await fetch(url, { headers }),
  );
  return response!.memberships;
};

export const addProjectMember = async (
  projectId: string,
  userIds: string[],
) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}/add-members`;

  const response = await handleApiResponse<{ memberships: Membership[] }>(
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify({ userIds }),
    }),
  );
  return response!.memberships;
};

export const removeProjectMember = async (membershipId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/memberships/${membershipId}`;

  const response = await handleApiResponse<void>(
    await fetch(url, { headers, method: "DELETE" }),
  );
  return response;
};

// columns service
// 1.fetch project columns
export const fetchColumns = async (projectId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}/columns`;

  const response = await handleApiResponse<{ columns: Column[] }>(
    await fetch(url, { headers }),
  );
  return response!.columns;
};
// 2.create project column
export const createColumn = async (
  projectId: string,
  input: CreateColumnInput,
) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}/column`;

  const response = await handleApiResponse<{ column: Column }>(
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(input),
    }),
  );
  return response!.column;
};
// 2.1 update project column (except order)
export const updateColumn = async (
  columnId: string,
  input: UpdateColumnInput,
) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/columns/${columnId}`;

  const response = await handleApiResponse<{ column: Column }>(
    await fetch(url, {
      headers,
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  );
  return response!.column;
};
// 2.2 swap column order
export interface SwapColumnResponse {
  success: true;
}
export const swapColumn = async (
  projectId: string,
  input: SwapColumnInput,
): Promise<SwapColumnResponse> => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/projects/${projectId}/columns/swap-order`;

  const response = await handleApiResponse<SwapColumnResponse>(
    await fetch(url, {
      headers,
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  );

  return response!;
};

// 3.delete project column
export const deleteColumn = async (columnId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/columns/${columnId}`;

  const response = await handleApiResponse<void>(
    await fetch(url, { headers, method: "DELETE" }),
  );
  return response;
};
// task section
// 1. create a task under a column
export const createTask = async (input: CreateTaskInput) => {
  const headers = await getCommonHeaders();
  const url = `${API_URL}/task`;
  const response = await handleApiResponse<{ task: TaskApiResponse }>(
    await fetch(url, { headers, method: "POST", body: JSON.stringify(input) }),
  );
  return response!.task;
};
// 2.1 udpate a task (except position in column)
export const updateTask = async (taskId: string, input: UpdateTaskInput) => {
  const headers = await getCommonHeaders();
  const url = `${API_URL}/task/${taskId}`;
  const response = await handleApiResponse<{ task: TaskApiResponse }>(
    await fetch(url, { headers, method: "PATCH", body: JSON.stringify(input) }),
  );
  return response!.task;
};
// getTasks
export const getTasksByColumn = async (columnId: string) => {
  const headers = await getCommonHeaders();
  const url = `${API_URL}/column/${columnId}/tasks`;
  const response = await handleApiResponse<{ tasks: TaskApiResponse[] }>(
    await fetch(url, { headers }),
  );
  return response!.tasks;
};
