import { api } from '../library/axios';
import { API_ROUTE } from '../const/apiRouter';

interface GetListRolesParams {
  token: string;
  skip?: number;
  limit?: number;
}

export const getListRoles = async ({
  token,
  skip,
  limit,
}: GetListRolesParams) => {
  const response = await api.get(API_ROUTE.GET_LIST_PROJECT_USERS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip,
      limit,
    },
  });

  return {
    assignments: response.data.assignments,
    total: response.data.total,
  };
};
