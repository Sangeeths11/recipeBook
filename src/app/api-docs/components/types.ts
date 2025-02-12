export interface Endpoint {
  method: string;
  path: string;
  description?: string;
  params?: { name: string; description: string; }[];
  requestBody?: any;
  response?: any;
  exampleBody?: string;
}

export interface Section {
  title: string;
  endpoints: Endpoint[];
} 