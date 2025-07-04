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
  const baseUrl = "https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api";
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