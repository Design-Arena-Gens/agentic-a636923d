export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "example-mcp-server",
      version: "1.0.0",
      description: "A Model Context Protocol server with echo, add, and get_time tools",
      status: "running",
      capabilities: {
        tools: ["echo", "add", "get_time"]
      },
      usage: {
        note: "This is an HTTP endpoint. For MCP protocol communication, use the stdio version.",
        tools: [
          {
            name: "echo",
            description: "Echoes back the input text",
            parameters: { message: "string" }
          },
          {
            name: "add",
            description: "Adds two numbers together",
            parameters: { a: "number", b: "number" }
          },
          {
            name: "get_time",
            description: "Returns the current server time",
            parameters: {}
          }
        ]
      }
    });
  }

  if (req.method === 'POST') {
    const { tool, arguments: args } = req.body || {};

    if (!tool) {
      return res.status(400).json({ error: "Tool name required" });
    }

    switch (tool) {
      case "echo":
        if (!args?.message) {
          return res.status(400).json({ error: "message parameter required" });
        }
        return res.status(200).json({
          result: `Echo: ${args.message}`
        });

      case "add":
        if (typeof args?.a !== 'number' || typeof args?.b !== 'number') {
          return res.status(400).json({ error: "a and b parameters (numbers) required" });
        }
        return res.status(200).json({
          result: `${args.a} + ${args.b} = ${args.a + args.b}`
        });

      case "get_time":
        return res.status(200).json({
          result: `Current server time: ${new Date().toISOString()}`
        });

      default:
        return res.status(404).json({ error: `Unknown tool: ${tool}` });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
