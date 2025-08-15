import { api } from "../library/axios";
import { API_ROUTE } from "../const/apiRouter";

export const deleteUserManagement = async (userProjectRoleId: string) => {
  try {
    const url = API_ROUTE.DELETE_PROJECT_USERS.replace(
      "{user_project_role_id}",
      userProjectRoleId
    );

    console.log("Đang gửi DELETE tới:", url);

    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá người dùng:", error);
    throw error;
  }
};
