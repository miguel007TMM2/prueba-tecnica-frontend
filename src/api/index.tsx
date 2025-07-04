export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  token?: string;
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

export async function apiRequest<T>({
  method = "GET",
  endpoint,
  token,
  body,
  headers = {},
}: ApiRequestOptions): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(baseUrl)
  const url = `${baseUrl}${endpoint}`;
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}