import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateProjectPayload {
  project_id: string;

  role_id: string;

  user_id: string;
}

// Đổi tên hàm từ CreateUserPayload thành createProject hoặc createUser
export const createUser = async (
  project_id: string,
  payload: CreateProjectPayload
) => {
  const url = API_ROUTE.CREATE_PROJECT_USERS.replace("{project_id}", project_id);
  const response = await api.post(url, payload);
  return response.data;
};
