const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function api(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const hasBody = options.body !== undefined && options.body !== null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    mode: "cors",
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? JSON.stringify(await res.json())
      : await res.text();
    throw new Error(payload || `API error ${res.status}`);
  }

  // на случай 204 No Content
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return await res.text();

  return res.json();
}

