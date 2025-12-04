#!/usr/bin/env node
/**
 * Quercle MCP Server
 *
 * An MCP server that provides AI-powered web fetching and search capabilities
 * through the Quercle API.
 */

import { FastMCP } from "fastmcp";
import {
  QuercleClient,
  QuercleError,
  fetchToolSchema,
  searchToolSchema,
  TOOL_DESCRIPTIONS,
} from "@quercle/sdk";

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
  version: "2.0.0",
});

// Register the fetch tool
server.addTool({
  name: "fetch",
  description: TOOL_DESCRIPTIONS.FETCH,
  parameters: fetchToolSchema,
  execute: async (args) => {
    try {
      return await client.fetch(args.url, args.prompt);
    } catch (error) {
      if (error instanceof QuercleError) {
        throw new Error(`[${error.statusCode}] ${error.message}`);
      }
      throw error;
    }
  },
});

// Register the search tool
server.addTool({
  name: "search",
  description: TOOL_DESCRIPTIONS.SEARCH,
  parameters: searchToolSchema,
  execute: async (args) => {
    try {
      return await client.search(args.query, {
        allowedDomains: args.allowed_domains,
        blockedDomains: args.blocked_domains,
      });
    } catch (error) {
      if (error instanceof QuercleError) {
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
