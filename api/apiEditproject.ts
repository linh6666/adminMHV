import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateProjectPayload {
  name: string;
  address: string;
  type: string;
  investor: string;
image_url:string;
  picture: string;
}

// Đổi tên hàm từ CreateUserPayload thành createProject hoặc createUser
export const createProject = async (payload: CreateProjectPayload) => {
  const response = await api.post(API_ROUTE.CREATE_PROJECTS, payload);
  return response.data;
};
