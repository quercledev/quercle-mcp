#!/usr/bin/env node
/**
 * Quercle MCP Server
 *
 * An MCP server that provides AI-powered web fetching and search capabilities
 * through the Quercle API.
 */

import { FastMCP } from "fastmcp";
import { QuercleClient, createClientFromEnv } from "./client.js";
import {
  fetchSchema,
  executeFetch,
  fetchToolDefinition,
} from "./tools/fetch.js";
import {
  searchSchema,
  executeSearch,
  searchToolDefinition,
} from "./tools/search.js";

// Initialize the Quercle client (will throw if QUERCLE_API_KEY is not set)
let client: QuercleClient;

try {
  client = createClientFromEnv();
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
  version: "1.0.0",
});

// Register the fetch tool
server.addTool({
  name: fetchToolDefinition.name,
  description: fetchToolDefinition.description,
  parameters: fetchSchema,
  execute: (args) => executeFetch(client, args),
});

// Register the search tool
server.addTool({
  name: searchToolDefinition.name,
  description: searchToolDefinition.description,
  parameters: searchSchema,
  execute: (args) => executeSearch(client, args),
});

// Start the server
void server.start({
  transportType: "stdio",
});
