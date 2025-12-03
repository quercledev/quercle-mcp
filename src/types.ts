/**
 * Quercle API response and request types
 */

import { z } from "zod";

// API Response Schemas (for runtime validation)
export const FetchResponseSchema = z.object({
  result: z.string(),
});

export const SearchResponseSchema = z.object({
  result: z.string(),
});

// API Response Types (inferred from schemas)
export type FetchResponse = z.infer<typeof FetchResponseSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

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
