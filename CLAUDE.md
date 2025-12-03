# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that wraps the Quercle API, providing AI-powered web fetching and search capabilities to Claude Desktop and Claude Code.

### What It Does

- **fetch tool**: Fetches a URL and analyzes its content using AI based on a user prompt
- **search tool**: Searches the web and returns AI-synthesized answers with citations

### Architecture

```
src/
├── index.ts          # MCP server entry point (FastMCP)
├── client.ts         # Quercle API client (HTTP requests)
├── types.ts          # TypeScript type definitions
└── tools/
    ├── fetch.ts      # Fetch tool (Zod schema + executor)
    └── search.ts     # Search tool (Zod schema + executor)
```

### Key Dependencies

- `fastmcp` - MCP server framework
- `zod` - Schema validation for tool parameters

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
| `QUERCLE_BASE_URL` | No | `https://quercle.dev` | API base URL |

## API Integration

This MCP server calls the Quercle API:

- `POST /api/v1/fetch` - Fetch and analyze a URL
- `POST /api/v1/search` - Search the web with AI synthesis

Both endpoints require `X-API-Key` header authentication.

## Error Handling

The client maps HTTP status codes to user-friendly messages:

- 401 → Invalid API key
- 402 → Insufficient credits
- 400 → Validation error (with details)
- 504 → Timeout

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
