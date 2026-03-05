# Measure.events MCP Server

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Connect AI agents to your web analytics. [Measure.events](https://measure.events) is the first analytics platform with a native [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server — your AI assistant can query traffic data, generate reports, and monitor trends without a dashboard.

## Why?

AI agents are becoming the primary interface for developer workflows. Your analytics data should be accessible where you work — inside Claude, Cursor, Windsurf, or any MCP-compatible client. No browser tabs. No dashboards. Just ask.

## Quick Start

### Option 1: Use the hosted MCP endpoint (recommended)

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "measure-events": {
      "url": "https://lets.measure.events/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Get your API key at [lets.measure.events](https://lets.measure.events) → Settings → API Keys.

### Option 2: Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "measure-events": {
      "url": "https://lets.measure.events/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Option 3: Cursor / Windsurf

Add to your `.cursor/mcp.json` or equivalent:

```json
{
  "mcpServers": {
    "measure-events": {
      "url": "https://lets.measure.events/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `get_site_analytics` | Get pageviews, visitors, and trends for any time period |
| `get_site_summary` | Natural language summary of your site's traffic |
| `get_insights` | AI-generated insights about traffic patterns, drops, and new referrers |
| `track_event` | Track custom events from your agent workflows |
| `list_sites` | List all sites in your account |
| `create_site` | Add a new site to track |

## Example Conversations

**"How's my site doing this week?"**

> Your site received 1,247 pageviews over the last 7 days, up 23% from last week. Top page: /blog/getting-started (312 views). New referrer: dev.to sent 47 visitors. Traffic peaked on Tuesday.

**"Any issues I should know about?"**

> ⚠️ Traffic dropped 45% on Thursday — check if there was a deployment or outage. New referrer: hackernews sent 89 visitors on Monday (spike). Your /pricing page has a 78% bounce rate — consider A/B testing the layout.

**"Track a deployment event"**

> ✅ Event tracked: `deployment` with metadata `{version: "2.1.0", environment: "production"}` at 2026-03-05T07:00:00Z.

## What is Measure.events?

[Measure.events](https://measure.events) is privacy-first web analytics built for the agent era:

- **No cookies** — compliant by default
- **Lightweight** — <1KB tracking script
- **Agent-native** — MCP server, REST API, `llms.txt` support
- **$29/month** — unlimited sites, 14-day free trial

## API Reference

Full REST API docs: [measure.events/docs](https://measure.events/docs)

The MCP server wraps the same API with MCP tool semantics. All tools accept `site_key` or `site_id` parameters to target specific sites.

## Protocol

This server implements the [Model Context Protocol](https://modelcontextprotocol.io) specification (version 2024-11-05). It supports:

- Tool discovery via `tools/list`
- Tool execution via `tools/call`
- HTTP+SSE transport at `https://lets.measure.events/mcp`

## License

MIT — see [LICENSE](LICENSE).

## Links

- [Measure.events](https://measure.events) — Marketing site
- [Dashboard](https://lets.measure.events) — Sign up / log in
- [API Docs](https://measure.events/docs) — REST API documentation
- [llms.txt](https://measure.events/llms.txt) — AI-readable site info
