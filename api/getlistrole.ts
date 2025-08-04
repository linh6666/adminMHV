// api/getlistrole.ts
import { api } from '../library/axios';
import { API_ROUTE } from '../const/apiRouter';

export const getListRoles = async (token: string) => {
  const response = await api.get(API_ROUTE.GET_LIST_ROLES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data; // chỉ trả về mảng
};
