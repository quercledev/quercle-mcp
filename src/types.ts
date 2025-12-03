/**
 * Quercle API response and request types
 */

// API Response Types
export interface FetchResponse {
  result: string;
}

export interface SearchResponse {
  result: string;
}

export interface ErrorResponse {
  detail: string;
  errors?: Array<{ message: string }>;
}

// Client Configuration
export interface QuercleConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// API Error class
export class QuercleError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: string
  ) {
    super(message);
    this.name = "QuercleError";
  }
}
