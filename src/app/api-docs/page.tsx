'use client';

import { useState } from 'react';
import ApiTester from './components/ApiTester';
import QuickActions from './components/QuickActions';
import { sections } from './data/sections';

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<{
    path: string;
    method: string;
    body?: string;
  } | null>(null);
  
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const handleEndpointSelect = (path: string, method: string, body?: string) => {
    setSelectedEndpoint({ path, method, body });
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Recipe API Documentation</h1>
        
        <ApiTester 
          selectedEndpoint={selectedEndpoint}
          onEndpointSelect={setSelectedEndpoint}
        />
        
        <QuickActions onEndpointSelect={handleEndpointSelect} />

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">API Endpoints</h2>
          
          {sections.map((section) => (
            <div key={section.title} className="mb-6 border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                <svg
                  className={`w-6 h-6 transform transition-transform text-gray-600 hover:text-gray-800 ${
                    expandedSections.includes(section.title) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.includes(section.title) && (
                <div className="p-4 space-y-4">
                  {section.endpoints.map((endpoint, index) => (
                    <div key={`${endpoint.method}-${endpoint.path}-${index}`} 
                         className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium
                          ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                            endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-gray-900 font-mono">{endpoint.path}</code>
                        <button
                          onClick={() => handleEndpointSelect(
                            endpoint.path,
                            endpoint.method,
                            endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : undefined
                          )}
                          className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                        >
                          Try it
                        </button>
                      </div>

                      <p className="text-gray-600 mb-3">{endpoint.description}</p>

                      {endpoint.params && endpoint.params.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">Query Parameters:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {endpoint.params.map((param) => (
                              <li key={param.name}>
                                <code className="text-gray-900">{param.name}</code>: {param.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {endpoint.requestBody && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">Request Body:</h4>
                          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto text-gray-900">
                            {JSON.stringify(endpoint.requestBody, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
                        <pre className="bg-gray-50 p-4 rounded-md text-base font-mono overflow-auto border border-gray-200 text-gray-900">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



