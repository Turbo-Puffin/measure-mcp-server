#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.MEASURE_API_URL || "https://lets.measure.events/api/v1";
const API_KEY = process.env.MEASURE_API_KEY || "";

if (!API_KEY) {
  console.error("MEASURE_API_KEY environment variable is required");
  console.error("Get your API key at https://lets.measure.events/settings");
  process.exit(1);
}

async function apiRequest(path, method = "GET", body = null) {
  const url = `${API_BASE}${path}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response.json();
}

const TOOLS = [
  {
    name: "list_sites",
    description:
      "List all sites tracked in your Measure.events account. Returns site IDs, domains, and tracking keys.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_pageviews",
    description:
      "Get pageview counts for a site over a time period. Returns total pageviews and a daily time series.",
    inputSchema: {
      type: "object",
      properties: {
        site_id: {
          type: "number",
          description: "Site ID (get from list_sites)",
        },
        period: {
          type: "string",
          description: "Time period: 'day', '7d', '30d', or '90d'",
          enum: ["day", "7d", "30d", "90d"],
          default: "7d",
        },
      },
      required: ["site_id"],
    },
  },
  {
    name: "get_top_pages",
    description:
      "Get the most viewed pages on a site. Shows which content is performing best.",
    inputSchema: {
      type: "object",
      properties: {
        site_id: {
          type: "number",
          description: "Site ID (get from list_sites)",
        },
        period: {
          type: "string",
          description: "Time period: 'day', '7d', '30d', or '90d'",
          enum: ["day", "7d", "30d", "90d"],
          default: "7d",
        },
      },
      required: ["site_id"],
    },
  },
  {
    name: "get_referrers",
    description:
      "Get traffic sources (referrers) for a site. Shows where visitors are coming from.",
    inputSchema: {
      type: "object",
      properties: {
        site_id: {
          type: "number",
          description: "Site ID (get from list_sites)",
        },
        period: {
          type: "string",
          description: "Time period: 'day', '7d', '30d', or '90d'",
          enum: ["day", "7d", "30d", "90d"],
          default: "7d",
        },
      },
      required: ["site_id"],
    },
  },
  {
    name: "get_site_summary",
    description:
      "Get a natural-language summary of a site's analytics. AI-friendly overview of traffic trends, top content, and referrers.",
    inputSchema: {
      type: "object",
      properties: {
        site_id: {
          type: "number",
          description: "Site ID (get from list_sites)",
        },
      },
      required: ["site_id"],
    },
  },
  {
    name: "track_event",
    description:
      "Track a custom event on a site. Use for conversions, signups, button clicks, or any custom metric.",
    inputSchema: {
      type: "object",
      properties: {
        site_key: {
          type: "string",
          description: "Site tracking key (get from list_sites)",
        },
        name: {
          type: "string",
          description: "Event name (e.g., 'signup', 'purchase', 'download')",
        },
        url: {
          type: "string",
          description: "Page URL where the event occurred",
        },
        metadata: {
          type: "object",
          description: "Optional key-value metadata for the event",
        },
      },
      required: ["site_key", "name"],
    },
  },
];

async function handleToolCall(name, args) {
  switch (name) {
    case "list_sites": {
      const data = await apiRequest("/sites");
      return JSON.stringify(data, null, 2);
    }

    case "get_pageviews": {
      const period = args.period || "7d";
      const data = await apiRequest(
        `/sites/${args.site_id}/pageviews?period=${period}`
      );
      return JSON.stringify(data, null, 2);
    }

    case "get_top_pages": {
      const period = args.period || "7d";
      const data = await apiRequest(
        `/sites/${args.site_id}/pages?period=${period}`
      );
      return JSON.stringify(data, null, 2);
    }

    case "get_referrers": {
      const period = args.period || "7d";
      const data = await apiRequest(
        `/sites/${args.site_id}/referrers?period=${period}`
      );
      return JSON.stringify(data, null, 2);
    }

    case "get_site_summary": {
      const data = await apiRequest(`/sites/${args.site_id}/summary`);
      return JSON.stringify(data, null, 2);
    }

    case "track_event": {
      const body = {
        name: args.name,
        url: args.url || "",
        metadata: args.metadata || {},
      };
      const data = await apiRequest(
        `/events?site_key=${args.site_key}`,
        "POST",
        body
      );
      return JSON.stringify(data, null, 2);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const server = new Server(
  {
    name: "measure-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleToolCall(name, args || {});
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Measure.events MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
