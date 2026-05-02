import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const server = new Server({
  name: "election-rag-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Mock function for embedding generation (in reality, you'd call OpenAI/Gemini/etc.)
async function generateEmbedding(text: string): Promise<number[]> {
  // Return a mock 1536-dimensional vector
  return Array.from({ length: 1536 }, () => Math.random() - 0.5);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_election_rules",
        description: "Query official election manuals, voter ID requirements, and constitutional guidelines.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The question or topic to search the rulebook for (e.g. 'voter ID requirements')"
            }
          },
          required: ["query"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query_election_rules") {
    const query = request.params.arguments?.query as string;
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
      await client.connect();
      
      // 1. Convert text query to vector
      const embedding = await generateEmbedding(query);
      const embeddingStr = `[${embedding.join(',')}]`;

      // 2. Perform vector similarity search in pgvector
      const res = await client.query(`
        SELECT content, 1 - (embedding <=> $1) as similarity
        FROM official_rules
        WHERE 1 - (embedding <=> $1) > 0.7
        ORDER BY embedding <=> $1
        LIMIT 3
      `, [embeddingStr]);

      const results = res.rows.map(row => row.content).join("\\n\\n");

      return {
        content: [
          {
            type: "text",
            text: results || "No specific rules found for this query in the database."
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error querying vector database: ${error.message}`
          }
        ],
        isError: true
      };
    } finally {
      await client.end();
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
