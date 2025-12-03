/**
 * Search tool - Search the web and get AI-synthesized answers
 */

import { z } from "zod";
import { QuercleClient } from "../client.js";
import { QuercleError } from "../types.js";

export const searchSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(1000)
    .describe("The search query to find information about. Be specific"),
  allowed_domains: z
    .array(z.string())
    .optional()
    .describe(
      "Only include results from these domains (e.g., ['example.com', '*.example.org'])"
    ),
  blocked_domains: z
    .array(z.string())
    .optional()
    .describe(
      "Exclude results from these domains (e.g., ['example.com', '*.example.org'])"
    ),
});

export type SearchInput = z.infer<typeof searchSchema>;

export async function executeSearch(
  client: QuercleClient,
  input: SearchInput
): Promise<string> {
  try {
    return await client.search(input.query, {
      allowed_domains: input.allowed_domains,
      blocked_domains: input.blocked_domains,
    });
  } catch (error) {
    if (error instanceof QuercleError) {
      throw new Error(`[${error.statusCode}] ${error.message}`);
    }
    throw error;
  }
}

export const searchToolDefinition = {
  name: "search",
  description:
    "Search the web and get an AI-synthesized answer with citations. The response includes the answer and source URLs that can be fetched for further investigation. Optionally filter by allowed or blocked domains.",
  parameters: searchSchema,
};
