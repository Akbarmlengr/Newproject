const BASE = "/api";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  search: (query) => request(`/items/search?q=${encodeURIComponent(query)}`),
  listTracked: () => request("/items"),
  track: (item) => request("/items", { method: "POST", body: JSON.stringify(item) }),
  untrack: (id) => request(`/items/${id}`, { method: "DELETE" }),
  checkNow: () => request("/check-now", { method: "POST" }),
};
