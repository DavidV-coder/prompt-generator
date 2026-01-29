export interface Model {
  id: string;
  name: string;
}

export interface Provider {
  value: string;
  label: string;
  models: Model[];
}

export interface TestApiRequest {
  provider: string;
  api_key: string;
}

export interface TestApiResponse {
  success: boolean;
  message: string;
}

export interface GenerateRequest {
  business: string;
  role: string;
  provider: string;
  api_key: string;
  model: string;
  system_prompt?: string;
}

export interface GenerateResponse {
  prompts: string[];
  role: string;
  business: string;
  provider: string;
  model: string;
}

export interface ApiError {
  detail: string;
}
