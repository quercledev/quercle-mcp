/**
 * Fetch tool - Fetch and analyze web content using AI
 */

import { z } from "zod";
import { QuercleClient } from "../client.js";
import { QuercleError } from "../types.js";

export const fetchSchema = z.object({
  url: z.url().describe("The URL to fetch and analyze"),
  prompt: z
    .string()
    .min(1)
    .describe("Instructions for how to analyze the page content"),
});

export type FetchInput = z.infer<typeof fetchSchema>;

export async function executeFetch(
  client: QuercleClient,
  input: FetchInput
): Promise<string> {
  try {
    return await client.fetch(input.url, input.prompt);
  } catch (error) {
    if (error instanceof QuercleError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export const fetchToolDefinition = {
  name: "fetch",
  description:
    "Fetch a web page and analyze its content using AI. Provide a URL and a prompt describing what information you want to extract or how to analyze the content.",
  parameters: fetchSchema,
};
