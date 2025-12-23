# 🚨 Quick Fix: MongoDB Connection Error

## The Problem
You're getting: `"Server selection timeout: No available servers"` or `"Connection refused"`

This means **MongoDB is not running or not accessible**.

---

## ✅ Solution: Use MongoDB Atlas (5 minutes)

**This is the fastest way to get started!**

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Verify your email

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Select **"M0 FREE"** (Free tier)
3. Choose a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `kenmark-admin` (or any username)
   - Password: Create a strong password (save it!)
5. Set privileges: **"Atlas admin"**
6. Click **"Add User"**

### Step 4: Allow Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env File
1. Open `.env` file in the project root
2. Replace the `DATABASE_URL` line with:
   ```env
   DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kenmark-bot?retryWrites=true&w=majority"
   ```
   - Replace `YOUR_USERNAME` with your database username
   - Replace `YOUR_PASSWORD` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - **Important:** Add `/kenmark-bot` before the `?` to specify database name

### Step 7: Test Connection
```bash
npm run test:db
```

You should see: ✅ Successfully connected to MongoDB!

### Step 8: Run Prisma Commands
```bash
npm run prisma:generate
npm run prisma:push
```

---

## 🎉 Done!

Your database is now set up! Continue with:
```bash
npm run init-knowledge
npm run dev
```

---

## Alternative: Local MongoDB

If you prefer local MongoDB, see [MONGODB_SETUP.md](./MONGODB_SETUP.md) for installation instructions.

---

## Still Having Issues?

1. **Check .env file exists** in project root
2. **Verify DATABASE_URL format** - should start with `mongodb://` or `mongodb+srv://`
3. **Check MongoDB Atlas cluster** is running (not paused)
4. **Verify IP whitelist** includes your IP or `0.0.0.0/0`
5. **Check username/password** are correct in connection string

For detailed troubleshooting, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)

