# MongoDB Setup Guide

## ⚠️ Important: MongoDB Must Be Running Before Running Prisma Commands

The error you're seeing means MongoDB is not running or not accessible. You have two options:

---

## Option 1: MongoDB Atlas (Cloud) - ⭐ RECOMMENDED (Easiest)

This is the easiest option and works immediately without local installation.

### Steps:

1. **Create Free Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free" and sign up

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" (Free tier)
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
     - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update Your .env File**
   ```env
   DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kenmark-bot?retryWrites=true&w=majority"
   ```
   - Replace `YOUR_USERNAME` with your database username
   - Replace `YOUR_PASSWORD` with your database password
   - Replace `cluster0.xxxxx` with your cluster address
   - Add `/kenmark-bot` before the `?` to specify the database name

7. **Test Connection**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

✅ **Done!** Your database is now set up in the cloud.

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB Community Server**
   - Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)

3. **Verify Installation**
   - MongoDB should start automatically as a Windows service
   - Check if it's running:
     ```powershell
     # Open PowerShell as Administrator
     Get-Service MongoDB
     ```
   - If not running, start it:
     ```powershell
     Start-Service MongoDB
     ```

4. **Update Your .env File**
   ```env
   DATABASE_URL="mongodb://localhost:27017/kenmark-bot"
   ```

5. **Test Connection**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

### For macOS:

1. **Install using Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Update Your .env File**
   ```env
   DATABASE_URL="mongodb://localhost:27017/kenmark-bot"
   ```

### For Linux:

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Update Your .env File**
   ```env
   DATABASE_URL="mongodb://localhost:27017/kenmark-bot"
   ```

---

## Verify MongoDB Connection

### Check if MongoDB is Running (Local)

**Windows:**
```powershell
Get-Service MongoDB
# Should show "Running"
```

**macOS/Linux:**
```bash
# Check if MongoDB process is running
ps aux | grep mongod

# Or check service status
brew services list  # macOS
sudo systemctl status mongod  # Linux
```

### Test Connection Manually

You can test the connection using MongoDB Compass or mongosh:

```bash
# Install mongosh if needed
# Then connect:
mongosh "mongodb://localhost:27017"
# Or for Atlas:
mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
```

---

## Troubleshooting

### Error: "Connection refused" or "No available servers"

**For Local MongoDB:**
- ✅ Ensure MongoDB service is running
- ✅ Check if port 27017 is not blocked by firewall
- ✅ Verify DATABASE_URL in .env file

**For MongoDB Atlas:**
- ✅ Check Network Access - ensure your IP is whitelisted
- ✅ Verify username and password in connection string
- ✅ Ensure cluster is not paused (free tier can pause after inactivity)
- ✅ Check connection string format

### Error: "Authentication failed"

- ✅ Verify username and password are correct
- ✅ Ensure special characters in password are URL-encoded
- ✅ Check database user has proper permissions

### Error: "Timeout"

- ✅ Check internet connection (for Atlas)
- ✅ Verify firewall settings
- ✅ Try adding `?retryWrites=true&w=majority` to connection string

---

## Quick Start (Recommended: Atlas)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `.env` file
5. Run:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

---

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Local Installation: https://docs.mongodb.com/manual/installation/
- Prisma MongoDB Guide: https://www.prisma.io/docs/concepts/database-connectors/mongodb

