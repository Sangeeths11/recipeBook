'use client';

import { useState } from 'react';
import { endpoints } from '../data/endpoints';


export default function QuickActions({ onEndpointSelect }: {
  onEndpointSelect: (endpoint: string, method: string, body?: string) => void;
}) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<string>('ALL');

  // Gruppiere Endpoints nach Methode
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.method]) {
      acc[endpoint.method] = [];
    }
    acc[endpoint.method].push(endpoint);
    return acc;
  }, {} as Record<string, typeof endpoints>);

  const handleEndpointClick = (endpoint: string, method: string, exampleBody?: string) => {
    setSelectedEndpoint(`${method} ${endpoint}`);
    onEndpointSelect(endpoint, method, exampleBody);
  };

  const methods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
      
      {/* Method Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => setActiveMethod(method)}
            className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap
              ${activeMethod === method 
                ? method === 'ALL' ? 'bg-gray-700 text-white'
                : method === 'GET' ? 'bg-blue-600 text-white'
                : method === 'POST' ? 'bg-green-600 text-white'
                : method === 'PUT' ? 'bg-yellow-600 text-white'
                : 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedEndpoints)
          .filter(([method]) => activeMethod === 'ALL' || method === activeMethod)
          .map(([method, methodEndpoints]) => (
            methodEndpoints.map((endpoint, index) => (
              <button
                key={`${endpoint.method}-${endpoint.path}-${index}`}
                onClick={() => handleEndpointClick(endpoint.path, endpoint.method, endpoint.exampleBody)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedEndpoint === `${endpoint.method} ${endpoint.path}`
                    ? 'bg-blue-50 border-blue-500 shadow-md text-gray-900'
                    : 'hover:bg-gray-50 border-gray-200 hover:shadow-md text-gray-700'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      method === 'POST' ? 'bg-green-100 text-green-700' :
                      method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {method}
                    </span>
                    <code className="text-sm text-gray-900 flex-1 text-left">{endpoint.path}</code>
                  </div>
                  {endpoint.description && (
                    <p className="text-sm text-gray-600 text-left">{endpoint.description}</p>
                  )}
                </div>
              </button>
            ))
          ))}
      </div>
    </div>
  );
} 