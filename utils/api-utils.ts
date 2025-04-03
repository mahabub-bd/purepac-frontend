type ApiResponse<T = any> = {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
  statusCode?: number;
  otpExpiresAt?: any;
};

export const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export async function fetchData<T>(endpoint: string): Promise<T> {
  const url = `${apiUrl}/${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Try to parse error response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP error! Status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  } catch (error: unknown) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

export async function postData<T = any>(
  endpoint: string,
  values?: any
): Promise<ApiResponse<T>> {
  const url = `${apiUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: values ? JSON.stringify(values) : undefined,
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP error! Status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function patchData(endpoint: string, values: any) {
  const url = `${apiUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP error! Status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Error patching data:", error);
    throw error;
  }
}

export async function deleteData(
  endpoint: string,
  id: string | number
): Promise<void> {
  const url = `${apiUrl}/${endpoint}/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP error! Status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}
