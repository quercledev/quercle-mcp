# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that wraps the Quercle API, providing AI-powered web fetching and search capabilities to Claude Desktop and Claude Code.

### What It Does

- **fetch**: Fetches a URL and analyzes its content using AI based on a user prompt
- **search**: Searches the web and returns AI-synthesized answers with citations
- **raw_fetch**: Fetches a URL and returns raw content (markdown or HTML) without AI processing
- **raw_search**: Searches the web and returns raw results (markdown or JSON) without AI synthesis
- **extract**: Fetches a URL and extracts structured data matching a query (markdown or JSON)

### Architecture

```
src/
└── index.ts          # MCP server entry point (FastMCP + @quercle/sdk)
```

### Key Dependencies

- `@quercle/sdk` - Quercle API client and tool schemas
- `fastmcp` - MCP server framework

## Commands

```bash
# Install dependencies
bun install

# Run all checks (typecheck, lint, format)
bun run check

# Build TypeScript to JavaScript
bun run build

# Lint and auto-fix
bun run lint:fix

# Format code
bun run format

# Run locally (for testing)
QUERCLE_API_KEY=your-key bun run start

# Publish to npm
bun publish
```

## Configuration

The server reads these environment variables at startup:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `QUERCLE_API_KEY` | Yes | - | API key from quercle.dev |

## API Integration

This MCP server calls the Quercle API via `@quercle/sdk` (`QuercleClient`):

- `POST /v1/fetch` - Fetch and analyze a URL with AI
- `POST /v1/search` - Search the web with AI synthesis
- `POST /v1/raw-fetch` - Fetch raw page content (markdown/HTML)
- `POST /v1/raw-search` - Search and return raw results (markdown/JSON)
- `POST /v1/extract` - Extract structured data from a URL

All endpoints require `Authorization: Bearer <key>` header authentication.

## Error Handling

All tool handlers catch `QuercleApiError` from `@quercle/sdk` and re-throw with the status code and message. The SDK maps HTTP errors to `QuercleApiError` with `statusCode` and `message` fields:

- 401 → Invalid API key
- 402 → Insufficient credits
- 400 → Validation error
- 504 → Timeout

The `raw_fetch`, `raw_search`, and `extract` tools also check the `unsafe` flag and prefix results with `[UNSAFE]` when the safeguard triggers.

## Testing

To test the MCP server locally:

1. Build: `bun run build`
2. Run: `QUERCLE_API_KEY=test-key bun run start`
3. The server communicates via stdio (MCP protocol)

For integration testing, use the MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Publishing

Before publishing:
1. Update version in `package.json`
2. Run `bun run check` to verify all checks pass
3. Run `bun publish`

The `prepublishOnly` script automatically runs checks and builds before publishing.
