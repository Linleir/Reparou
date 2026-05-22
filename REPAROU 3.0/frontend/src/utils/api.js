const API = "http://localhost:5001";

export function getAuthToken() {
  try {
    const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");
    return saved?.token || null;
  } catch (_) {
    return null;
  }
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response, resource, actionMessage) {
  if (!response.ok) {
    let detail = "";

    try {
      const data = await response.json();
      detail = data?.error ? `: ${data.error}` : "";
    } catch (_) {
      detail = "";
    }

    throw new Error(`${actionMessage} ${resource}${detail}`);
  }

  return response.json();
}

export async function apiGet(resource) {
  const response = await fetch(`${API}/${resource}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, resource, "Falha ao buscar");
}

export async function apiPost(resource, payload) {
  const response = await fetch(`${API}/${resource}`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, resource, "Falha ao salvar em");
}

export async function apiPut(resource, id, payload) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, resource, "Falha ao atualizar");
}

export async function apiPatch(resource, id, payload) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, resource, "Falha ao atualizar");
}

export async function apiDelete(resource, id) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, resource, "Falha ao excluir");
}
