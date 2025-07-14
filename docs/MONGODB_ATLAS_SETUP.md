# MongoDB Atlas Setup for Railway

## Fix MongoDB Connection Issues

### 1. Network Access Settings

The most common cause of connection failures is network access restrictions.

1. **Go to MongoDB Atlas Dashboard**
2. **Click on "Network Access" in the left sidebar**
3. **Add IP Address**:
   - For testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add Railway's IP ranges (more secure but complex)

### 2. Database User Permissions

1. **Go to "Database Access" in MongoDB Atlas**
2. **Check your database user has:**
   - Read and write permissions to your database
   - Correct username and password

### 3. Connection String Format

Your connection string should look like:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

Make sure to:
- Replace `username` with your database username
- Replace `password` with your database password
- Replace `cluster-name.xxxxx` with your actual cluster
- Replace `database-name` with your database name (e.g., `designvisualz`)

### 4. Special Characters in Password

If your password contains special characters like `@`, `#`, `$`, etc., you need to URL encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `:` becomes `%3A`
- `/` becomes `%2F`

Example:
- Password: `p@ss#word`
- Encoded: `p%40ss%23word`

### 5. Testing the Connection

1. **Locally**: 
   ```bash
   MONGODB_URL='your-connection-string' python3 test_mongodb_connection.py
   ```

2. **Check Railway Logs**:
   - Look for "Successfully connected to MongoDB"
   - Or error messages that indicate the specific issue

### 6. Railway Environment Variables

Make sure in Railway Variables tab you have:
- `MONGODB_URL` = Your full connection string
- `DATABASE_NAME` = Your database name (if different from the one in the URL)

### Common Error Messages

- **"Authentication failed"**: Wrong username/password or user doesn't exist
- **"Network timeout"**: Network access not configured, add 0.0.0.0/0
- **"SSL handshake failed"**: Try adding `&tls=true&tlsAllowInvalidCertificates=true` to connection string
- **"Server selection timeout"**: Usually network access issue or wrong cluster address