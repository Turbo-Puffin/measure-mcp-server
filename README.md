# Measure.events MCP Server

[![MCP](https://img.shields.io/badge/MCP-compatible-brightgreen)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for [Measure.events](https://measure.events) — privacy-first web analytics that AI agents can use natively.

Connect your AI coding assistant (Claude Desktop, Cursor, Windsurf, etc.) to your web analytics. Ask questions like "how's my traffic this week?" or "what are my top pages?" and get real answers from real data.

## Why?

Every analytics platform has a dashboard. None of them talk to your AI tools.

Measure.events is the first analytics platform with a native MCP server. Your AI assistant can check traffic, find top content, identify referrers, and track events — all without you opening a browser.

## Tools

| Tool | Description |
|------|-------------|
| `list_sites` | List all tracked sites in your account |
| `get_pageviews` | Pageview counts with daily time series |
| `get_top_pages` | Most viewed pages on a site |
| `get_referrers` | Traffic sources and referring domains |
| `get_site_summary` | AI-friendly natural language analytics summary |
| `track_event` | Track custom events (signups, purchases, etc.) |

## Setup

### 1. Get your API key

Sign up at [lets.measure.events](https://lets.measure.events) and grab your API key from Settings.

### 2. Install

```bash
npm install @turbo-puffin/measure-mcp-server
```

Or run directly with npx:

```bash
npx @turbo-puffin/measure-mcp-server
```

### 3. Configure your MCP client

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "measure": {
      "command": "npx",
      "args": ["-y", "@turbo-puffin/measure-mcp-server"],
      "env": {
        "MEASURE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "measure": {
      "command": "npx",
      "args": ["-y", "@turbo-puffin/measure-mcp-server"],
      "env": {
        "MEASURE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Windsurf

Add to your Windsurf MCP configuration:

```json
{
  "mcpServers": {
    "measure": {
      "command": "npx",
      "args": ["-y", "@turbo-puffin/measure-mcp-server"],
      "env": {
        "MEASURE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MEASURE_API_KEY` | Yes | Your Measure.events API key |
| `MEASURE_API_URL` | No | Custom API base URL (default: `https://lets.measure.events/api/v1`) |

## Example Usage

Once configured, ask your AI assistant:

- "What's my traffic looking like this week?"
- "Which pages are getting the most views on propfirmdeck.com?"
- "Where is my traffic coming from?"
- "Give me a summary of my analytics"
- "Track a signup event for my site"

## Hosted MCP Endpoint

Measure.events also provides a hosted MCP endpoint for server-to-server integration:

```
POST https://lets.measure.events/mcp
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{"jsonrpc": "2.0", "method": "initialize", "id": 1, "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0"}}}
```

## About Measure.events

[Measure.events](https://measure.events) is privacy-first web analytics built for the AI era. No cookies, no personal data, GDPR/CCPA compliant out of the box. The only analytics platform where AI agents are first-class citizens.

- 🔒 Privacy-first — no cookies, no fingerprinting
- 🤖 Agent-native — MCP server + REST API
- ⚡ Lightweight — single script tag, <1KB
- 📊 Real-time — see traffic as it happens

## License

MIT — see [LICENSE](LICENSE) for details.
