import { BASE_API_FASTAPI } from "../config";
import { API_ROUTE } from "../const/apiRouter";

export async function loginUser(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const res = await fetch(`${BASE_API_FASTAPI}${API_ROUTE.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await res.json();

  // Lưu token vào cookie
  if (data.access_token) {
    document.cookie = `token=${data.access_token}; path=/;`;
  }

  return data;
}
