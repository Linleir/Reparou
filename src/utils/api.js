const API = 'http://localhost:3001';

export async function apiGet(resource) {
  const response = await fetch(`${API}/${resource}`);
  if (!response.ok) throw new Error(`Falha ao buscar ${resource}`);
  return response.json();
}

export async function apiPost(resource, payload) {
  const response = await fetch(`${API}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Falha ao salvar em ${resource}`);
  return response.json();
}

export async function apiPatch(resource, id, payload) {
  const response = await fetch(`${API}/${resource}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Falha ao atualizar ${resource}`);
  return response.json();
}
