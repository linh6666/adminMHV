// /api/userApi.ts
import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter"; // ✅ import đúng object chứa hằng số

export interface CreateUserPayload {
  rank_total: number;
  description: string;

}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post(API_ROUTE.CREATE_SYSTEM, payload); // ✅ dùng đúng key từ object
  return response.data;
};