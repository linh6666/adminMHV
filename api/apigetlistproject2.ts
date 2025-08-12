
import { api } from '../library/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListRolesParams {
  token: string;
  skip?: number;
  limit?: number;
   lang?: string;
}

export const getListRoles = async ({
  token,
  skip,
  limit,
 lang = 'en',
}: GetListRolesParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_PROJECTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip,
      limit,
         lang,
    },
  });

  return {
    data: response.data.data,
    total: response.data.count, // Sửa từ `total` thành `count`
  };
};