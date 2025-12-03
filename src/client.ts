/**
 * Quercle API Client
 */

import {
  QuercleConfig,
  FetchResponse,
  SearchResponse,
  ErrorResponse,
  QuercleError,
} from "./types.js";

const DEFAULT_BASE_URL = "https://quercle.dev";
const DEFAULT_TIMEOUT = 120000; // 120 seconds (generous for search operations)

export class QuercleClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: QuercleConfig) {
    if (!config.apiKey) {
      throw new QuercleError(
        "API key is required. Get one at https://quercle.dev",
        401
      );
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
  }

  /**
   * Fetch and analyze content from a URL using AI
   */
  async fetch(url: string, prompt: string): Promise<string> {
    const response = await this.request<FetchResponse>("/api/v1/fetch", {
      url,
      prompt,
    });
    return response.result;
  }

  /**
   * Search the web and get AI-synthesized answers with sources
   */
  async search(
    query: string,
    options?: {
      allowed_domains?: string[];
      blocked_domains?: string[];
    }
  ): Promise<string> {
    const body: Record<string, unknown> = { query };

    if (options?.allowed_domains && options.allowed_domains.length > 0) {
      body.allowed_domains = options.allowed_domains;
    }
    if (options?.blocked_domains && options.blocked_domains.length > 0) {
      body.blocked_domains = options.blocked_domains;
    }

    const response = await this.request<SearchResponse>("/api/v1/search", body);
    return response.result;
  }

  /**
   * Make a request to the Quercle API
   */
  private async request<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleError(response);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof QuercleError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new QuercleError(
            "Request timed out. Try a simpler query or shorter content.",
            504
          );
        }
        throw new QuercleError(`Network error: ${error.message}`, 0);
      }

      throw new QuercleError("An unexpected error occurred", 0);
    }
  }

  /**
   * Handle API error responses
   */
  private async handleError(response: Response): Promise<never> {
    let errorDetail = "";

    try {
      const errorBody = (await response.json()) as ErrorResponse;
      errorDetail = errorBody.detail || "";

      if (errorBody.errors && errorBody.errors.length > 0) {
        errorDetail += " " + errorBody.errors.map((e) => e.message).join(", ");
      }
    } catch {
      errorDetail = response.statusText;
    }

    switch (response.status) {
      case 400:
        throw new QuercleError(
          `Invalid request: ${errorDetail}`,
          400,
          errorDetail
        );
      case 401:
        throw new QuercleError(
          "Invalid or missing API key. Get one at https://quercle.dev",
          401,
          errorDetail
        );
      case 402:
        throw new QuercleError(
          "Insufficient credits. Top up at https://quercle.dev",
          402,
          errorDetail
        );
      case 403:
        throw new QuercleError(
          "Account is inactive. Contact support at https://quercle.dev",
          403,
          errorDetail
        );
      case 404:
        throw new QuercleError("Resource not found", 404, errorDetail);
      case 504:
        throw new QuercleError(
          "Request timed out. Try a simpler query.",
          504,
          errorDetail
        );
      default:
        throw new QuercleError(
          `Quercle API error (${response.status}): ${errorDetail}`,
          response.status,
          errorDetail
        );
    }
  }
}

/**
 * Create a Quercle client from environment variables
 */
export function createClientFromEnv(): QuercleClient {
  const apiKey = process.env.QUERCLE_API_KEY;
  const baseUrl = process.env.QUERCLE_BASE_URL;

  if (!apiKey) {
    throw new QuercleError(
      "QUERCLE_API_KEY environment variable is required. Get an API key at https://quercle.dev",
      401
    );
  }

  return new QuercleClient({
    apiKey,
    baseUrl,
  });
}
