# MCP Server

The shadcn MCP server enables AI assistants to search, browse, and install components from registries.

## Setup

### Prerequisites

- Node.js 18+ installed
- shadcn/ui project initialized

### Installation

```bash
npx @shadcn/mcp-server
```

### Configuration

Add to your AI assistant's MCP configuration:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["@shadcn/mcp-server"],
      "env": {
        "SHADCN_REGISTRY": "default"
      }
    }
  }
}
```

## Available Tools

### search_components

Search for components in the registry.

**Input:**

```json
{
  "query": "button dialog card",
  "limit": 10
}
```

**Output:**

```json
{
  "results": [
    {
      "name": "button",
      "description": "Displays a button",
      "url": "https://ui.shadcn.com/components/button"
    },
    {
      "name": "card",
      "description": "Displays a card",
      "url": "https://ui.shadcn.com/components/card"
    }
  ]
}
```

### get_component_info

Get detailed information about a component.

**Input:**

```json
{
  "name": "button"
}
```

**Output:**

```json
{
  "name": "button",
  "description": "Displays a button",
  "installation": "npx shadcn@latest add button",
  "files": [
    "components/ui/button.tsx"
  ],
  "dependencies": [],
  "props": [
    {
      "name": "variant",
      "type": "default | destructive | outline | secondary | ghost | link",
      "default": "default"
    },
    {
      "name": "size",
      "type": "default | sm | lg | icon",
      "default": "default"
    }
  ]
}
```

### get_component_code

Get the source code for a component.

**Input:**

```json
{
  "name": "button"
}
```

**Output:**

```json
{
  "name": "button",
  "code": "// Component source code...",
  "language": "typescript"
}
```

### add_component

Add a component to your project.

**Input:**

```json
{
  "name": "button"
}
```

**Output:**

```json
{
  "success": true,
  "files": [
    "components/ui/button.tsx"
  ]
}
```

### browse_registry

Browse available components in a registry.

**Input:**

```json
{
  "registry": "default",
  "category": "forms"
}
```

**Output:**

```json
{
  "components": [
    {
      "name": "checkbox",
      "description": "Checkbox component"
    },
    {
      "name": "radio-group",
      "description": "Radio group component"
    }
  ]
}
```

## Usage Example

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["@shadcn/mcp-server"],
      "env": {
        "SHADCN_REGISTRY": "default"
      }
    }
  }
}
```

### Cursor

Add to Cursor settings:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["@shadcn/mcp-server"]
    }
  }
}
```

### VS Code Copilot Chat

Configure in VS Code settings:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["@shadcn/mcp-server"]
    }
  }
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SHADCN_REGISTRY` | default | Registry to use |
| `SHADCN_PATH` | ./components/ui | Output path |
| `SHADCN_SKIP_CONFIRM` | false | Skip confirmation prompts |

## Troubleshooting

### Server not starting

```bash
# Check Node.js version
node --version

# Install dependencies
npm install
```

### Connection refused

```bash
# Try running directly
npx @shadcn/mcp-server

# Check for port conflicts
lsof -i :3000
```

### Component not found

```bash
# Update registry
npx shadcn@latest init --force

# Clear cache
rm -rf ~/.shadcn/cache
```

## Learn More

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Skills Documentation](https://skills.sh)
