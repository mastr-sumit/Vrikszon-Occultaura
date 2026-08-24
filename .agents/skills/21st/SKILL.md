---
name: 21st
description: "21st.dev MCP & component discovery skill for AI agents. Search 12,000+ curated React, Tailwind CSS, Framer Motion, and shadcn/ui components, inspect live implementation code, discover UI patterns, and generate modern component variants from 21st.dev catalog."
---

# 21st.dev Component Discovery & UI Generation

Connect to the [21st.dev](https://21st.dev) component catalog (12,000+ production-ready React, Tailwind, Framer Motion, and shadcn/ui components) to find, inspect, generate, and install curated components.

## Configured Credentials

- **21st API Key**: `YOUR_21ST_API_KEY`
- **MCP Endpoint**: `https://21st.dev/api/mcp`
- **Header**: `x-api-key: YOUR_21ST_API_KEY`

## When to Use

- When looking for modern React/Tailwind components (pricing tables, hero sections, bento grids, navigation menus, cards, animated tabs, modals, etc.)
- When seeking inspiration or ready-made patterns from 21st.dev
- When looking for Framer Motion micro-animations, glassmorphism, or modern UI interactions
- When generating tailored component variants with 21st AI

## How to Search 21st.dev

### 1. Web & Direct Component Fetch
Search the 21st library for specific component categories:
- Navigation & Headers
- Heroes & Banners
- Bento Grids & Feature Sections
- Pricing Tables & Testimonials
- Interactive Cards & Badges
- Animated Buttons & Micro-interactions

### 2. CLI Usage
When using the 21st CLI in terminal:
```bash
# Set API key for the session
export API_KEY_21ST="YOUR_21ST_API_KEY"

# Search catalog
21st search "<query>"

# Generate UI with 21st AI
21st generate "<prompt>" --variants 3

# Publish custom components / themes
21st publish-theme ./theme.css --name "<theme-name>"
21st publish ./Component.tsx
```

## MCP Client Configuration

### Remote SSE Endpoint:
```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": {
        "x-api-key": "YOUR_21ST_API_KEY"
      }
    }
  }
}
```

### CLI / Stdio Proxy:
```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "YOUR_21ST_API_KEY"
      }
    }
  }
}
```
