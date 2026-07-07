// Auto-generated API client for Custom ICON 1.1
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function api_icons() {
  const res = await fetch(`http://localhost:3001/api/icons`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    
  });
  if (!res.ok) throw new Error('GET /api/icons failed: ' + res.status);
  return res.json();
}

export async function api_icons_id_get(id: any) {
  const res = await fetch(`http://localhost:3001/api/icons/{id}?id=${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    
  });
  if (!res.ok) throw new Error('GET /api/icons/{id} failed: ' + res.status);
  return res.json();
}

export async function api_icons_post(name: any, data: any) {
  const res = await fetch(`http://localhost:3001/api/icons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data })
  });
  if (!res.ok) throw new Error('POST /api/icons failed: ' + res.status);
  return res.json();
}

export async function api_icons_id_put(id: any, name: any, data: any) {
  const res = await fetch(`http://localhost:3001/api/icons/{id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, data })
  });
  if (!res.ok) throw new Error('PUT /api/icons/{id} failed: ' + res.status);
  return res.json();
}

export async function api_icons_id_patch(id: any, name: any, data: any) {
  const res = await fetch(`http://localhost:3001/api/icons/{id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, data })
  });
  if (!res.ok) throw new Error('PATCH /api/icons/{id} failed: ' + res.status);
  return res.json();
}

export async function api_icons_id_delete(id: any) {
  const res = await fetch(`http://localhost:3001/api/icons/{id}?id=${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    
  });
  if (!res.ok) throw new Error('DELETE /api/icons/{id} failed: ' + res.status);
  return res.json();
}

export async function api_icons_import(file: any, name: any) {
  const res = await fetch(`http://localhost:3001/api/icons/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file, name })
  });
  if (!res.ok) throw new Error('POST /api/icons/import failed: ' + res.status);
  return res.json();
}
