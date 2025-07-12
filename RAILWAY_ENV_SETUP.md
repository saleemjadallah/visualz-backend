# Railway Environment Variables Setup

## Required Environment Variables

You need to set these environment variables in your Railway project settings:

### Database
- `MONGODB_URL` - Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
- `DATABASE_NAME` - Your database name (e.g., `visualz` or `designvisualz`)

### API Keys
- `OPENAI_API_KEY` - Your OpenAI API key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Security
- `SECRET_KEY` - A secure secret key for JWT tokens (generate a random string)

### Optional
- `ENVIRONMENT` - Set to `production` for Railway (defaults to production)
- `DEBUG` - Set to `false` for production (defaults to false)

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service (backend)
3. Go to the "Variables" tab
4. Click "RAW Editor" or add variables one by one
5. Add all the required variables listed above
6. Railway will automatically restart your service

## Example Variables (RAW format)

```
MONGODB_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/designvisualz?retryWrites=true&w=majority
DATABASE_NAME=designvisualz
OPENAI_API_KEY=sk-...your-api-key...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SECRET_KEY=your-secure-random-secret-key
ENVIRONMENT=production
DEBUG=false
```

## Debugging

To check if environment variables are being loaded correctly:

1. Check Railway logs for the startup messages
2. The debug_env.py script can help verify variables are set
3. The /health/detailed endpoint shows connection status

## Common Issues

1. **MongoDB URL not configured**: Make sure MONGODB_URL is set in Railway variables
2. **Connection timeout**: Ensure your MongoDB cluster allows connections from Railway's IP ranges
3. **Invalid connection string**: Check that your MongoDB URL is properly formatted with credentials

## GitHub Secrets vs Railway Variables

- GitHub Secrets are for GitHub Actions workflows
- Railway uses its own environment variable system
- You cannot directly use GitHub Secrets in Railway deployments
- You must manually copy the values from GitHub Secrets to Railway Variables