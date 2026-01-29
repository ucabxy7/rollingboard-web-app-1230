import { ProjectFormData } from "@/models/projects";
import { getCommonHeaders, handleApiResponse } from "./base";
import { Project } from "@/models/projects";
import { Pagination } from "@/models/pagination";
import { Membership } from "@/models/memberships";

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

export const removeProjectMember = async (userId: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/memberships/${userId}`;

  const response = await handleApiResponse<void>(
    await fetch(url, { headers, method: "DELETE" }),
  );
  return response;
};
