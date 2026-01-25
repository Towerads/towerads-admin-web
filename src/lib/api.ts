const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function api(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    mode: "cors",              // 🔥 ВАЖНО
    credentials: "include",    // 🔥 ВАЖНО (у тебя cors с credentials)
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }

  return res.json();
}

