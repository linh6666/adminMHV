// /api/apicreatesystem.ts
import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateUserPayload {
 
     project_name: string,
      project_id:string,
  user_id?: string;
  role_id?: string;
}

export const createUser = async (
  project_id: string,
  payload: CreateUserPayload
) => {
  const url = API_ROUTE.CREATE_PROJECT_USERS.replace("{project_id}", project_id);
  const response = await api.post(url, payload);
  return response.data;
};