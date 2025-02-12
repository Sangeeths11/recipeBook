'use client';

import { useState, useEffect } from 'react';

// Add this interface at the top of your ApiTester component file
interface ApiTesterProps {
  selectedEndpoint: {
    path: string;
    method: string;
    body?: string;
  } | null;
  onEndpointSelect: (endpoint: { path: string; method: string; body?: string; } | null) => void;
}

export default function ApiTester({ selectedEndpoint, onEndpointSelect }: ApiTesterProps) {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEndpoint) {
      setEndpoint(selectedEndpoint.path);
      setMethod(selectedEndpoint.method);
      setRequestBody(selectedEndpoint.body || '');
      // Reset response when endpoint changes
      setResponse('');
      
      // Scroll to ApiTester component
      const apiTester = document.getElementById('api-tester');
      if (apiTester) {
        apiTester.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedEndpoint]);

  // Reset response when manually changing endpoint or method
  const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndpoint(e.target.value);
    setResponse('');
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value);
    setResponse('');
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequestBody(e.target.value);
    setResponse('');
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const response = await fetch(`/api${endpoint}`, options);
      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: 'Failed to fetch' }, null, 2));
    }
    setLoading(false);
  };

  return (
    <div id="api-tester" className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Test API Endpoints</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <select
            value={method}
            onChange={handleMethodChange}
            className="px-3 py-2 border rounded-md text-gray-900 w-24"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={endpoint}
            onChange={handleEndpointChange}
            placeholder="/endpoint"
            className="flex-1 px-3 py-2 border rounded-md text-gray-900"
          />
        </div>

        {(method === 'POST' || method === 'PUT') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Body (JSON)
            </label>
            <textarea
              value={requestBody}
              onChange={handleBodyChange}
              rows={5}
              className="w-full px-3 py-2 border rounded-md text-gray-900 font-mono text-sm"
              placeholder="{}"
            />
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={loading || !endpoint}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test Endpoint'}
        </button>

        {response && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response
            </label>
            <pre className={`p-4 rounded-md overflow-auto max-h-96 text-sm font-mono ${
              (() => {
                try {
                  const jsonResponse = JSON.parse(response);
                  return jsonResponse.success === true
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800';
                } catch {
                  return 'bg-red-50 text-red-800';
                }
              })()
            }`}>
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 