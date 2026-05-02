import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_CIVIC_API_KEY;

const server = new Server({
  name: "election-localization-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_election_info",
        description: "Get election dates, polling locations, and officials for a given address using Civic Information API",
        inputSchema: {
          type: "object",
          properties: {
            address: {
              type: "string",
              description: "User's full address or ZIP code"
            }
          },
          required: ["address"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_election_info") {
    const address = request.params.arguments?.address as string;
    
    if (!API_KEY) {
      throw new Error("GOOGLE_CIVIC_API_KEY is not configured");
    }

    try {
      // 1. Fetch Voter Info (polling locations, election dates)
      const voterInfoRes = await axios.get("https://www.googleapis.com/civicinfo/v2/voterinfo", {
        params: {
          key: API_KEY,
          address: address,
          electionId: 2000 // default or query for specific
        }
      });

      // 2. Fetch Representatives (current elected officials)
      const repInfoRes = await axios.get("https://www.googleapis.com/civicinfo/v2/representatives", {
        params: {
          key: API_KEY,
          address: address
        }
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              electionInfo: voterInfoRes.data,
              officials: repInfoRes.data
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching civic info: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
