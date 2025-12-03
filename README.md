# Quercle MCP

[![npm version](https://badge.fury.io/js/quercle-mcp.svg)](https://www.npmjs.com/package/quercle-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server for [Quercle](https://quercle.dev) - AI-powered web fetching and search.

## Features

- **fetch** - Fetch any web page and analyze its content using AI
- **search** - Search the web and get AI-synthesized answers with citations

## Quick Start

### 1. Get an API Key

Sign up at [quercle.dev](https://quercle.dev) to get your API key.

### 2. Configure Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "quercle": {
      "command": "npx",
      "args": ["-y", "quercle-mcp"],
      "env": {
        "QUERCLE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Restart Claude Desktop to load the new MCP server.

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `QUERCLE_API_KEY` | Yes | - | Your Quercle API key from [quercle.dev](https://quercle.dev) |
| `QUERCLE_BASE_URL` | No | `https://quercle.dev` | API base URL (for self-hosted instances) |

## Tools

### fetch

Fetch a web page and analyze its content using AI.

**Parameters:**
- `url` (string, required) - The URL to fetch and analyze
- `prompt` (string, required) - Instructions for how to analyze the page content

**Example:**
```
Fetch https://example.com/article and summarize the main points
```

### search

Search the web and get an AI-synthesized answer with citations.

**Parameters:**
- `query` (string, required) - The search query
- `allowed_domains` (string[], optional) - Only include results from these domains
- `blocked_domains` (string[], optional) - Exclude results from these domains

**Example:**
```
Search for "TypeScript best practices 2024" and only include results from *.edu domains
```

## Claude Code Configuration

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "quercle": {
      "command": "npx",
      "args": ["-y", "quercle-mcp"],
      "env": {
        "QUERCLE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Alternative Installation

If you prefer to install globally:

```bash
npm install -g quercle-mcp
```

Then update your configuration to use `quercle-mcp` directly:

```json
{
  "mcpServers": {
    "quercle": {
      "command": "quercle-mcp",
      "env": {
        "QUERCLE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Troubleshooting

### "API key is required" error

Make sure `QUERCLE_API_KEY` is set in your MCP server configuration's `env` section.

### "Insufficient credits" error

Your account has run out of credits. Top up at [quercle.dev](https://quercle.dev).

### Timeout errors

For complex queries or large pages, the request may time out. Try:
- Using a simpler prompt
- Targeting a specific section of the page
- Breaking your search into smaller queries

### Connection issues

1. Verify your API key is correct
2. Check your internet connection
3. Try again in a few moments

## Development

```bash
# Clone the repository
git clone https://github.com/quercle/quercle-mcp.git
cd quercle-mcp

# Install dependencies
bun install

# Run all checks (typecheck, lint, format)
bun run check

# Build
bun run build

# Run locally
QUERCLE_API_KEY=your-key bun run start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run build` | Compile TypeScript to JavaScript |
| `bun run check` | Run all checks (typecheck + lint + format) |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |
| `bun run typecheck` | Run TypeScript type checking |

## License

MIT - see [LICENSE](LICENSE) for details.

## Links

- [Quercle Website](https://quercle.dev)
- [GitHub Repository](https://github.com/quercle/quercle-mcp)
- [npm Package](https://www.npmjs.com/package/quercle-mcp)
- [MCP Documentation](https://modelcontextprotocol.io)
