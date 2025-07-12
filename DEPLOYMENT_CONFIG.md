# Deployment Configuration

## Railway Deployment

This project uses **railway.json** as the single source of deployment configuration.

### Why Double Deployments Were Happening

Multiple deployment configuration files can cause Railway to deploy twice:
- `railway.json` - Current configuration (KEEP THIS)
- `railway.toml` - Old format (REMOVED)
- `Procfile` - Heroku-style (REMOVED)
- `Dockerfile` - Container deployment (KEPT for future use)

### Current Configuration

The `railway.json` file contains all deployment settings:
- Build configuration (uses NIXPACKS)
- Start command with environment check
- Health check configuration
- Restart policies

### Railway Dashboard Settings

Also check your Railway dashboard for:
1. **GitHub Integration**: Make sure you only have ONE service connected to this repo
2. **Deploy Triggers**: Check Settings → Deploy Triggers
   - Should only have "Push to branch" enabled
   - Disable "Push to any branch" if enabled
3. **Multiple Services**: Ensure you don't have duplicate services

### Dockerfile

The Dockerfile is kept for potential future use but Railway uses NIXPACKS by default.
To use Docker instead, change builder in railway.json:
```json
"build": {
  "builder": "DOCKERFILE"
}
```