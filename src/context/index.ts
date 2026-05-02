import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const server = new Server({
  name: "election-context-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

let redisClient: ReturnType<typeof createClient>;

async function getRedisClient() {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not configured");
    }
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
  }
  return redisClient;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "save_session_state",
        description: "Save user's location and their current phase in the election timeline.",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: { type: "string" },
            location: { type: "string" },
            phase: { type: "string", enum: ["registration", "research", "voting", "post-election"] }
          },
          required: ["sessionId"]
        }
      },
      {
        name: "get_session_state",
        description: "Retrieve a user's saved location and election phase.",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: { type: "string" }
          },
          required: ["sessionId"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const client = await getRedisClient();

  if (request.params.name === "save_session_state") {
    const { sessionId, location, phase } = request.params.arguments as any;
    
    try {
      const state = {
        location: location || "",
        phase: phase || "registration",
        updatedAt: new Date().toISOString()
      };
      
      await client.set(`session:${sessionId}`, JSON.stringify(state), {
        EX: 86400 // Expire in 24 hours
      });

      return {
        content: [
          {
            type: "text",
            text: `Session state saved for ${sessionId}`
          }
        ]
      };
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error saving state: ${error.message}` }], isError: true };
    }
  }

  if (request.params.name === "get_session_state") {
    const { sessionId } = request.params.arguments as any;
    
    try {
      const stateStr = await client.get(`session:${sessionId}`);
      if (!stateStr) {
        return {
          content: [
            { type: "text", text: "No session state found." }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: stateStr
          }
        ]
      };
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error retrieving state: ${error.message}` }], isError: true };
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
