const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async <T>(
  method: "POST" | "GET",
  endPoint: string,
  data: T | null = null,
  formData?: FormData
): Promise<{ status: number; data?: any; error?: string }> => {
  const token = sessionStorage.getItem("authToken");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | null = null;

  if (formData) {
    body = formData;
  } else if (data != null) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  const options: RequestInit = {
    method,
    headers,
    ...(method !== "GET" ? { body } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${endPoint}`, options);
    const status = response.status;

    const responseData = await response.json();
    return { status, data: responseData };
  } catch (e) {
    console.error("API request failed:", e);
    return {
      status: 500,
      error: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};
