// /api/userApi.ts
import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter";

export interface CreateProjectPayload {
  name_vi: string;
  address_vi: string;
  type_vi: string;
  investor_vi: string;
  name_en: string;
  address_en: string;
  type_en: string;
  investor_en: string;
  picture: string;
}

// Đổi tên hàm từ CreateUserPayload thành createProject hoặc createUser
export const createProject = async (payload: CreateProjectPayload) => {
  const response = await api.post(API_ROUTE.CREATE_PROJECTS, payload);
  return response.data;
};
