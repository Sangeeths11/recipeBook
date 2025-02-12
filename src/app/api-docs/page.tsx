'use client';

import { useState } from 'react';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: { name: string; description: string; }[];
  requestBody?: any;
  response: any;
}

export default function ApiDocs() {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

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

  const handleEndpointClick = (endpoint: string, method: string, exampleBody?: string) => {
    setEndpoint(endpoint);
    setMethod(method);
    setRequestBody(exampleBody || '');
    setSelectedEndpoint(`${method} ${endpoint}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Recipe API Documentation</h1>
        
        {/* API Testing Interface */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Test API Endpoints</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border rounded p-2 text-gray-900 bg-white"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                type="text"
                placeholder="/recipes"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="border rounded p-2 flex-1 text-gray-900"
              />
              <button
                onClick={handleTest}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            {method !== 'GET' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Request Body (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={5}
                  className="w-full border rounded p-2 font-mono text-gray-900 bg-white"
                />
              </div>
            )}
            
            {response && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Response
                </label>
                <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-96">
                  {response}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endpoints.map((endpoint) => (
              <button
                key={`${endpoint.method}-${endpoint.path}`}
                onClick={() => handleEndpointClick(endpoint.path, endpoint.method, endpoint.exampleBody)}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedEndpoint === `${endpoint.method} ${endpoint.path}`
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium mb-2 ${
                  endpoint.method === 'GET' ? 'bg-green-600 text-white' :
                  endpoint.method === 'POST' ? 'bg-blue-600 text-white' :
                  endpoint.method === 'PUT' ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {endpoint.method}
                </span>
                <div className="font-mono text-sm text-gray-900">{endpoint.path}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{section.title}</h2>
              <div className="space-y-6">
                {section.endpoints.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-600 text-white' :
                        endpoint.method === 'POST' ? 'bg-blue-600 text-white' :
                        endpoint.method === 'PUT' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-900 mb-4">{endpoint.description}</p>
                    
                    {endpoint.params && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-gray-900">Parameters:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-900">
                          {endpoint.params.map((param) => (
                            <li key={param.name}>
                              <code className="text-blue-600">{param.name}</code>: {param.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {endpoint.requestBody && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-gray-900">Request Body:</h4>
                        <pre className="bg-gray-800 text-white p-4 rounded text-sm">
                          {JSON.stringify(endpoint.requestBody, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Response:</h4>
                      <pre className="bg-gray-800 text-white p-4 rounded text-sm">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const endpoints = [
  { method: 'GET', path: '/recipes' },
  { method: 'GET', path: '/recipes/123' },
  { method: 'POST', path: '/recipes', exampleBody: JSON.stringify({
    title: "New Recipe",
    description: "Description",
    preparationTime: 30,
    difficulty: "medium",
    categories: ["categoryId1", "categoryId2"],
    ingredients: [
      { ingredient: "ingredientId", amount: 100, unit: "g" }
    ],
    instructions: "Step by step instructions"
  }, null, 2) },
  { method: 'PUT', path: '/recipes/123' },
  { method: 'DELETE', path: '/recipes/123' },
  { method: 'POST', path: '/recipes/123/comments', exampleBody: JSON.stringify({
    text: "Great recipe!",
    authorName: "John Doe",
    rating: 5
  }, null, 2) }
];

const sections: { title: string; endpoints: Endpoint[]; }[] = [
  {
    title: "Recipes",
    endpoints: [
      {
        method: "GET",
        path: "/recipes",
        description: "Get all recipes with optional filtering",
        params: [
          { name: "search", description: "Search in title and description" },
          { name: "difficulty", description: "Filter by difficulty (easy, medium, hard)" },
          { name: "category", description: "Filter by category name" }
        ],
        response: {
          success: true,
          data: [{
            _id: "string",
            title: "string",
            description: "string",
            difficulty: "easy|medium|hard",
            preparationTime: "number",
            categories: ["Category"],
            ingredients: [{
              ingredient: "Ingredient",
              amount: "number",
              unit: "string"
            }]
          }]
        }
      },
      {
        method: "POST",
        path: "/recipes",
        description: "Create a new recipe",
        requestBody: {
          title: "string",
          description: "string",
          preparationTime: "number",
          difficulty: "easy|medium|hard",
          categories: ["categoryId"],
          ingredients: [{
            ingredient: "ingredientId",
            amount: "number",
            unit: "g|kg|ml|l|piece|tbsp|tsp|cup"
          }],
          instructions: "string"
        },
        response: {
          success: true,
          data: "Created Recipe Object"
        }
      },
      {
        method: "GET",
        path: "/recipes/:id",
        description: "Get a specific recipe by ID",
        response: {
          success: true,
          data: "Recipe Object"
        }
      },
      {
        method: "PUT",
        path: "/recipes/:id",
        description: "Update a recipe",
        requestBody: {
          title: "string",
          description: "string",
          preparationTime: "number",
          difficulty: "easy|medium|hard",
          categories: ["categoryId"],
          ingredients: [{
            ingredient: "ingredientId",
            amount: "number",
            unit: "string"
          }],
          instructions: "string"
        },
        response: {
          success: true,
          data: "Updated Recipe Object"
        }
      },
      {
        method: "DELETE",
        path: "/recipes/:id",
        description: "Delete a recipe",
        response: {
          success: true
        }
      }
    ]
  },
  {
    title: "Recipe Comments",
    endpoints: [
      {
        method: "POST",
        path: "/recipes/:id/comments",
        description: "Add a comment to a recipe",
        requestBody: {
          text: "string",
          authorName: "string",
          rating: "number (1-5)"
        },
        response: {
          success: true,
          data: "Created Comment Object"
        }
      }
    ]
  }
]; 