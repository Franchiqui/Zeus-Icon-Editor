'use client';
import React, { useState } from 'react';

const ENDPOINTS = [{"id":"list-icons","method":"GET","path":"/api/icons","description":"Obtiene todos los iconos almacenados"},{"id":"get-icon","method":"GET","path":"/api/icons/{id}","description":"Obtiene un icono por su ID"},{"id":"create-icon","method":"POST","path":"/api/icons","description":"Crea un nuevo icono con datos JSON"},{"id":"update-icon","method":"PUT","path":"/api/icons/{id}","description":"Actualiza completamente un icono por ID"},{"id":"patch-icon","method":"PATCH","path":"/api/icons/{id}","description":"Actualiza parcialmente un icono por ID"},{"id":"delete-icon","method":"DELETE","path":"/api/icons/{id}","description":"Elimina un icono por ID"},{"id":"import-icon","method":"POST","path":"/api/icons/import","description":"Importa un icono desde un archivo SVG"}];

export default function ApiDashboard() {
  const [params, setParams] = useState<any[]>([{}, {}, {}, {}, {}, {}, {}]);
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [results, setResults] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const updateParam = (idx: number, key: string, value: any) => {
    setParams(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const updateFileParam = (idx: number, file: File | null) => {
    setFiles(prev => ({ ...prev, [idx]: file }));
  };

  const testEndpoint = async (idx: number) => {
    setLoading(prev => ({ ...prev, [idx]: true }));
    setErrors(prev => ({ ...prev, [idx]: '' }));
    try {
      const ep = ENDPOINTS[idx];
      let res;
      switch (idx) {
      case 0:
        res = await fetch('http://localhost:3001/api/icons', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        break;
      case 1:
        res = await fetch(`http://localhost:3001/api/icons/${encodeURIComponent(params[1]['id'] || '')}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        break;
      case 2:
        res = await fetch(`http://localhost:3001/api/icons?name=${encodeURIComponent(params[2]['name'] || '')}&data=${encodeURIComponent(params[2]['data'] || '')}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params[2]) });
        break;
      case 3:
        res = await fetch(`http://localhost:3001/api/icons/{id}?id=${encodeURIComponent(params[3]['id'] || '')}&name=${encodeURIComponent(params[3]['name'] || '')}&data=${encodeURIComponent(params[3]['data'] || '')}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params[3]) });
        break;
      case 4:
        res = await fetch(`http://localhost:3001/api/icons/{id}?id=${encodeURIComponent(params[4]['id'] || '')}&name=${encodeURIComponent(params[4]['name'] || '')}&data=${encodeURIComponent(params[4]['data'] || '')}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params[4]) });
        break;
      case 5:
        res = await fetch(`http://localhost:3001/api/icons/{id}?id=${encodeURIComponent(params[5]['id'] || '')}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
        break;
      case 6:
        const formData = new FormData();
        if (files[6]) formData.append('file', files[6]);
        if (params[6]['name']) formData.append('name', params[6]['name']);
        res = await fetch('http://localhost:3001/api/icons/import', { method: 'POST', body: formData });
        break;
      }
      if (!res || !res.ok) throw new Error(ep.method + ' ' + ep.path + ' failed: ' + (res?.status || 'unknown'));
      const data = await res.json();
      setResults(prev => ({ ...prev, [idx]: data }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [idx]: err.message || 'Error' }));
    } finally {
      setLoading(prev => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Dashboard</h1>
      <p className="text-gray-400 mb-6">Custom ICON 1.1 — 7 endpoints disponibles</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-800 rounded-lg">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Método</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Path</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Descripción</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody>
              <tr key="list-icons" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-900 text-green-300">GET</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">/api/icons</td>
                <td className="px-3 py-2 text-sm text-gray-400">Obtiene todos los iconos almacenados</td>
                <td className="px-3 py-2">
                  
                  <button onClick={() => testEndpoint(0)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[0] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[0] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[0], null, 2)}</pre>
                    </div>
                  )}
                  {errors[0] && (
                    <div className="mt-2 text-xs text-red-400">{errors[0]}</div>
                  )}
                </td>
              </tr>
              <tr key="get-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-900 text-green-300">GET</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">{'/api/icons/{id}'}</td>
                <td className="px-3 py-2 text-sm text-gray-400">Obtiene un icono por su ID</td>
                <td className="px-3 py-2">
                  
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400">id (Requerido)</label>
                      <input
                        type="text"
                        value={params[1]['id'] || ''}
                        onChange={(e) => updateParam(1, 'id', e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        placeholder="ID del icono"
                      />
                    </div>
                  <button onClick={() => testEndpoint(1)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[1] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[1] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[1], null, 2)}</pre>
                    </div>
                  )}
                  {errors[1] && (
                    <div className="mt-2 text-xs text-red-400">{errors[1]}</div>
                  )}
                </td>
              </tr>
              <tr key="create-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-900 text-blue-300">POST</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">/api/icons</td>
                <td className="px-3 py-2 text-sm text-gray-400">Crea un nuevo icono con datos JSON</td>
                <td className="px-3 py-2">
                  
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400">Cuerpo JSON</label>
                        <textarea
                          value={JSON.stringify(params[2], null, 2)}
                          onChange={(e) => {
                            try {
                              updateParam(2, 'jsonBody', JSON.parse(e.target.value));
                            } catch {
                              // Invalid JSON, keep as string for now
                              updateParam(2, 'jsonBody', e.target.value);
                            }
                          }}
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white h-32 font-mono"
                          placeholder="{}"
                        ></textarea>
                      </div>
                  <button onClick={() => testEndpoint(2)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[2] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[2] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[2], null, 2)}</pre>
                    </div>
                  )}
                  {errors[2] && (
                    <div className="mt-2 text-xs text-red-400">{errors[2]}</div>
                  )}
                </td>
              </tr>
              <tr key="update-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-yellow-900 text-yellow-300">PUT</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">{'/api/icons/{id}'}</td>
                <td className="px-3 py-2 text-sm text-gray-400">Actualiza completamente un icono por ID</td>
                <td className="px-3 py-2">
                  
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400">Cuerpo JSON</label>
                        <textarea
                          value={JSON.stringify(params[3], null, 2)}
                          onChange={(e) => {
                            try {
                              updateParam(3, 'jsonBody', JSON.parse(e.target.value));
                            } catch {
                              // Invalid JSON, keep as string for now
                              updateParam(3, 'jsonBody', e.target.value);
                            }
                          }}
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white h-32 font-mono"
                          placeholder="{}"
                        ></textarea>
                      </div>
                  <button onClick={() => testEndpoint(3)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[3] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[3] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[3], null, 2)}</pre>
                    </div>
                  )}
                  {errors[3] && (
                    <div className="mt-2 text-xs text-red-400">{errors[3]}</div>
                  )}
                </td>
              </tr>
              <tr key="patch-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-yellow-900 text-yellow-300">PATCH</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">{'/api/icons/{id}'}</td>
                <td className="px-3 py-2 text-sm text-gray-400">Actualiza parcialmente un icono por ID</td>
                <td className="px-3 py-2">
                  
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400">Cuerpo JSON</label>
                        <textarea
                          value={JSON.stringify(params[4], null, 2)}
                          onChange={(e) => {
                            try {
                              updateParam(4, 'jsonBody', JSON.parse(e.target.value));
                            } catch {
                              // Invalid JSON, keep as string for now
                              updateParam(4, 'jsonBody', e.target.value);
                            }
                          }}
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white h-32 font-mono"
                          placeholder="{}"
                        ></textarea>
                      </div>
                  <button onClick={() => testEndpoint(4)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[4] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[4] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[4], null, 2)}</pre>
                    </div>
                  )}
                  {errors[4] && (
                    <div className="mt-2 text-xs text-red-400">{errors[4]}</div>
                  )}
                </td>
              </tr>
              <tr key="delete-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-900 text-red-300">DELETE</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">{'/api/icons/{id}'}</td>
                <td className="px-3 py-2 text-sm text-gray-400">Elimina un icono por ID</td>
                <td className="px-3 py-2">
                  
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400">id (Requerido)</label>
                      <input
                        type="text"
                        value={params[5]['id'] || ''}
                        onChange={(e) => updateParam(5, 'id', e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        placeholder="ID del icono"
                      />
                    </div>
                  <button onClick={() => testEndpoint(5)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[5] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[5] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[5], null, 2)}</pre>
                    </div>
                  )}
                  {errors[5] && (
                    <div className="mt-2 text-xs text-red-400">{errors[5]}</div>
                  )}
                </td>
              </tr>
              <tr key="import-icon" className="border-b border-gray-800">
                <td className="px-3 py-2 text-sm"><span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-900 text-blue-300">POST</span></td>
                <td className="px-3 py-2 text-sm text-gray-300">/api/icons/import</td>
                <td className="px-3 py-2 text-sm text-gray-400">Importa un icono desde un archivo SVG</td>
                <td className="px-3 py-2">
                  
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400">Archivo SVG</label>
                          <input
                            type="file"
                            accept=".svg"
                            onChange={(e) => updateFileParam(6, e.target.files?.[0] || null)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400">Nombre del icono</label>
                          <input
                            type="text"
                            value={params[6]['name'] || ''}
                            onChange={(e) => updateParam(6, 'name', e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            placeholder="Nombre del icono"
                          />
                        </div>
                      </div>
                  <button onClick={() => testEndpoint(6)} className="mt-2 px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs rounded">{loading[6] ? 'Ejecutando...' : 'Probar'}</button>
                  {results[6] && (
                    <div className="mt-2 text-xs bg-gray-900 border border-gray-700 rounded p-2 max-h-32 overflow-auto">
                      <pre className="text-green-400">{JSON.stringify(results[6], null, 2)}</pre>
                    </div>
                  )}
                  {errors[6] && (
                    <div className="mt-2 text-xs text-red-400">{errors[6]}</div>
                  )}
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
