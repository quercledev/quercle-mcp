# @quercle/mcp

An [MCP](https://modelcontextprotocol.io/) server for Quercle — AI-powered web search and fetch.

Gives Claude (and any MCP client) the ability to search the web and fetch + analyze pages.

## Quick Start

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "quercle": {
      "command": "npx",
      "args": ["-y", "@quercle/mcp"],
      "env": {
        "QUERCLE_API_KEY": "qk_..."
      }
    }
  }
}
```

Restart Claude Desktop. You'll see the Quercle tools available in the chat.

### Claude Code

```bash
claude mcp add --transport stdio --env QUERCLE_API_KEY=qk_... quercle -- npx -y @quercle/mcp
```

### Global Install (alternative)

```bash
npm install -g @quercle/mcp
```

Then reference `quercle-mcp` instead of `npx -y @quercle/mcp` in your config.

## Setup

Get your API key at [quercle.dev](https://quercle.dev) and set it in the config as shown above.

## Tools

The server exposes five tools:

### `search`

Search the web and get an AI-synthesized answer with citations.

| Parameter | Required | Description |
|---|---|---|
| `query` | Yes | The search query |
| `allowedDomains` | No | Only return results from these domains |
| `blockedDomains` | No | Exclude results from these domains |

### `fetch`

Fetch a URL and analyze its content with AI.

| Parameter | Required | Description |
|---|---|---|
| `url` | Yes | The URL to fetch |
| `prompt` | Yes | Instructions for how to analyze the page content |

### `raw_search`

Search the web and get raw results (without AI synthesis).

| Parameter | Required | Description |
|---|---|---|
| `query` | Yes | The search query |
| `format` | No | Response format: `markdown` (default) or `json` |
| `useSafeguard` | No | Enable content safeguards (boolean) |

### `raw_fetch`

Fetch raw content from a URL without AI processing.

| Parameter | Required | Description |
|---|---|---|
| `url` | Yes | The URL to fetch |
| `format` | No | Response format: `markdown` (default) or `html` |
| `useSafeguard` | No | Enable content safeguards (boolean) |

### `extract`

Extract relevant content from a URL based on a query.

| Parameter | Required | Description |
|---|---|---|
| `url` | Yes | The URL to extract content from |
| `query` | Yes | What to extract from the page |
| `format` | No | Response format: `markdown` (default) or `json` |
| `useSafeguard` | No | Enable content safeguards (boolean) |

## Troubleshooting

| Issue | Solution |
|---|---|
| "Missing API key" | Set `QUERCLE_API_KEY` in the `env` section of your config |
| "Invalid API key" | Check your key starts with `qk_` and is valid at [quercle.dev](https://quercle.dev) |
| Timeout errors | The API may take up to 60s for complex queries — this is normal |
| Server not connecting | Run `npx -y @quercle/mcp` directly to check for errors |

## License

MIT
