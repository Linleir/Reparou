const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function getAuthToken() {
  try {
    const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");
    return saved?.accessToken || null;
  } catch (_) {
    return null;
  }
}

export function setAuthToken(accessToken) {
  try {
    const saved = JSON.parse(localStorage.getItem("reparouAuth") || "null");
    if (saved) {
      saved.accessToken = accessToken;
      localStorage.setItem("reparouAuth", JSON.stringify(saved));
    }
  } catch (_) {
    // Silenciar erros
  }
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response, resource, actionMessage, options = {}) {
  if (response.status === 401 && !options.skipRefresh) {
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setAuthToken(newToken);
        return null;
      }
    } catch (_) {
      // Token refresh falhou, logout será necessário
    }
  }

  if (!response.ok) {
    let detail = "";
    let serverError = "";
    let serverDetails = null;

    try {
      const data = await response.json();
      serverError = data?.error || "";
      serverDetails = Array.isArray(data?.details) ? data.details : null;
      detail = serverError ? `: ${serverError}` : "";
    } catch (_) {
      detail = "";
    }

    const error = new Error(`${actionMessage} ${resource}${detail}`);
    error.status = response.status;
    error.serverError = serverError;
    error.details = serverDetails;
    throw error;
  }

  return response.json();
}

async function refreshAccessToken() {
  try {
    const response = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        refreshToken: localStorage.getItem("reparouRefreshToken"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
  } catch (_) {
    // Falha ao atualizar token
  }
  return null;
}

export async function apiGet(resource) {
  const response = await fetch(`${API}/${resource}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await handleResponse(response, resource, "Falha ao buscar");
  if (data) return data;

  throw new Error("Token expirado. Por favor, faça login novamente.");
}

export async function apiPost(resource, payload, options = {}) {
  const response = await fetch(`${API}/${resource}`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response, resource, "Falha ao salvar em", options);
  if (data) return data;

  throw new Error("Token expirado. Por favor, faça login novamente.");
}

export async function apiPut(resource, id, payload) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response, resource, "Falha ao atualizar");
  if (data) return data;

  throw new Error("Token expirado. Por favor, faça login novamente.");
}

export async function apiPatch(resource, id, payload) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response, resource, "Falha ao atualizar");
  if (data) return data;

  throw new Error("Token expirado. Por favor, faça login novamente.");
}

export async function apiDelete(resource, id) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await handleResponse(response, resource, "Falha ao excluir");
  if (data) return data;

  throw new Error("Token expirado. Por favor, faça login novamente.");
}
