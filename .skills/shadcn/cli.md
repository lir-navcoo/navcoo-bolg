# CLI Reference

The `shadcn` CLI provides commands for managing components in your project.

## Prerequisites

1. Initialize your project with `shadcn init`
2. A `components.json` file must exist in your project root

## Commands

### init

Initialize a new shadcn/ui project.

```bash
shadcn init [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--yes` | boolean | false | Skip confirmation prompt |
| `--defaults` | boolean | false | Use default settings (TypeScript, Tailwind CSS, CSS variables) |
| `--style` | string | default | Component style (default/rounded/new-york) |
| `--base-color` | string | neutral | Base color for components |
| `--css-variables` | boolean | true | Use CSS variables for theming |
| `--tailwind` | boolean | true | Configure Tailwind CSS |
| `--src-dir` | boolean | false | Use src directory |
| `--app-dir` | string | false | App router components directory |
| `--import-alias` | string | @/* | Import alias for components |

### add

Add a component to your project.

```bash
shadcn add [components...] [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--yes` | boolean | false | Skip confirmation prompt |
| `--path` | string | ./components/ui | Output path for components |
| `--overwrite` | boolean | false | Overwrite existing files |
| `--single` | boolean | false | Generate single component file |
| `--dry-run` | boolean | false | Preview changes without writing files |
| `--registry` | string | - | Custom registry to use |

**Examples:**

```bash
# Add a single component
shadcn add button

# Add multiple components
shadcn add button card dialog

# Add with all defaults
shadcn add button --yes

# Preview without writing
shadcn add form --dry-run
```

### list

List all available components.

```bash
shadcn list [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--json` | boolean | false | Output as JSON |

**Example:**

```bash
shadcn list
shadcn list --json
```

### search

Search for components.

```bash
shadcn search [query]
```

**Example:**

```bash
shadcn search dialog
shadcn search form input
```

### docs

Open component documentation in browser.

```bash
shadcn docs [component]
```

**Example:**

```bash
shadcn docs button
shadcn docs dialog
```

### diff

Check for component updates.

```bash
shadcn diff [component] [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--component` | string | - | Specific component to check |
| `--force` | boolean | false | Force update without prompts |

**Example:**

```bash
# Check all components
shadcn diff

# Check specific component
shadcn diff button
```

### info

Get information about your project configuration.

```bash
shadcn info [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--json` | boolean | false | Output as JSON |

**Example:**

```bash
shadcn info
shadcn info --json
```

**JSON Output Example:**

```json
{
  "project": {
    "name": "my-app",
    "framework": "next-app",
    "typescript": true,
    "tailwind": true,
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    }
  },
  "components": {
    "installed": ["button", "card", "dialog"]
  },
  "paths": {
    "components": "./components",
    "utils": "./lib/utils.ts"
  }
}
```

### build

Build a custom component.

```bash
shadcn build [options]
```

**Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--component` | string | - | Component name |
| `--registry` | string | - | Registry to use |
| `--yes` | boolean | false | Skip confirmation |

**Example:**

```bash
shadcn build my-component
shadcn build my-component --registry=default
```

## Configuration

### components.json

The `components.json` file stores your project configuration.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Tips

1. **Dry Run**: Use `--dry-run` to preview changes before applying them
2. **Batch Add**: Add multiple components at once: `shadcn add button card dialog`
3. **Force Update**: Use `--overwrite` to update existing components
4. **Custom Registry**: Use `--registry` to add components from custom registries

## Troubleshooting

### Command not found

```bash
npm install -g shadcn-ui
```

### Permission denied

```bash
sudo npm install -g shadcn-ui
```

### Outdated version

```bash
npm update -g shadcn-ui
```
