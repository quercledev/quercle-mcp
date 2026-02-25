#!/usr/bin/env node
/**
 * Quercle MCP Server
 *
 * An MCP server that provides AI-powered web fetching and search capabilities
 * through the Quercle API.
 */

import { FastMCP } from "fastmcp";
import { QuercleClient, QuercleApiError, toolMetadata } from "@quercle/sdk";
import { z } from "zod";

const fetchToolSchema = z.object({
  url: z.string().describe(toolMetadata.fetch.parameters.url),
  prompt: z.string().describe(toolMetadata.fetch.parameters.prompt),
});

const searchToolSchema = z.object({
  query: z.string().describe(toolMetadata.search.parameters.query),
  allowedDomains: z
    .array(z.string())
    .optional()
    .describe(toolMetadata.search.parameters.allowed_domains),
  blockedDomains: z
    .array(z.string())
    .optional()
    .describe(toolMetadata.search.parameters.blocked_domains),
});

const rawFetchToolSchema = z.object({
  url: z.string().describe(toolMetadata.rawFetch.parameters.url),
  format: z
    .enum(["markdown", "html"])
    .optional()
    .describe(toolMetadata.rawFetch.parameters.format),
  useSafeguard: z
    .boolean()
    .optional()
    .describe(toolMetadata.rawFetch.parameters.use_safeguard),
});

const rawSearchToolSchema = z.object({
  query: z.string().describe(toolMetadata.rawSearch.parameters.query),
  format: z
    .enum(["markdown", "json"])
    .optional()
    .describe(toolMetadata.rawSearch.parameters.format),
  useSafeguard: z
    .boolean()
    .optional()
    .describe(toolMetadata.rawSearch.parameters.use_safeguard),
});

const extractToolSchema = z.object({
  url: z.string().describe(toolMetadata.extract.parameters.url),
  query: z.string().describe(toolMetadata.extract.parameters.query),
  format: z
    .enum(["markdown", "json"])
    .optional()
    .describe(toolMetadata.extract.parameters.format),
  useSafeguard: z
    .boolean()
    .optional()
    .describe(toolMetadata.extract.parameters.use_safeguard),
});

// Initialize the Quercle client (reads QUERCLE_API_KEY from environment)
let client: QuercleClient;

try {
  client = new QuercleClient();
} catch {
  console.error(
    "Error: QUERCLE_API_KEY environment variable is required.\n" +
      "Get an API key at https://quercle.dev"
  );
  process.exit(1);
}

// Create the MCP server
const server = new FastMCP({
  name: "quercle",
  version: "3.0.0",
});

// Register the fetch tool
server.addTool({
  name: "fetch",
  description: toolMetadata.fetch.description,
  parameters: fetchToolSchema,
  execute: async (args) => {
    try {
      return (await client.fetch(args.url, args.prompt)).result;
    } catch (error) {
      if (error instanceof QuercleApiError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Register the search tool
server.addTool({
  name: "search",
  description: toolMetadata.search.description,
  parameters: searchToolSchema,
  execute: async (args) => {
    try {
      return (
        await client.search(args.query, {
          allowedDomains: args.allowedDomains,
          blockedDomains: args.blockedDomains,
        })
      ).result;
    } catch (error) {
      if (error instanceof QuercleApiError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Register the raw_fetch tool
server.addTool({
  name: "raw_fetch",
  description: toolMetadata.rawFetch.description,
  parameters: rawFetchToolSchema,
  execute: async (args) => {
    try {
      const response = await client.rawFetch(args.url, {
        format: args.format,
        useSafeguard: args.useSafeguard,
      });
      const text =
        typeof response.result === "string"
          ? response.result
          : JSON.stringify(response.result);
      return response.unsafe ? `[UNSAFE] ${text}` : text;
    } catch (error) {
      if (error instanceof QuercleApiError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Register the raw_search tool
server.addTool({
  name: "raw_search",
  description: toolMetadata.rawSearch.description,
  parameters: rawSearchToolSchema,
  execute: async (args) => {
    try {
      const response = await client.rawSearch(args.query, {
        format: args.format,
        useSafeguard: args.useSafeguard,
      });
      const text =
        typeof response.result === "string"
          ? response.result
          : JSON.stringify(response.result);
      return response.unsafe ? `[UNSAFE] ${text}` : text;
    } catch (error) {
      if (error instanceof QuercleApiError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Register the extract tool
server.addTool({
  name: "extract",
  description: toolMetadata.extract.description,
  parameters: extractToolSchema,
  execute: async (args) => {
    try {
      const response = await client.extract(args.url, args.query, {
        format: args.format,
        useSafeguard: args.useSafeguard,
      });
      const text =
        typeof response.result === "string"
          ? response.result
          : JSON.stringify(response.result);
      return response.unsafe ? `[UNSAFE] ${text}` : text;
    } catch (error) {
      if (error instanceof QuercleApiError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Start the server
void server.start({
  transportType: "stdio",
});
