# Mobile Network Setup Guide

This guide explains how to access your Word Record Generator on mobile devices connected to the same local network.

## What Changed

Your project has been updated to support network access from mobile devices:

### 1. **Vite Configuration** (`frontend/vite.config.js`)
- Added `host: true` to the server config → Vite dev server now listens on all network interfaces (0.0.0.0)
- Updated proxy target to use `VITE_API_URL` environment variable

### 2. **Flask Configuration** (`app.py`)
- Changed `app.run(debug=False)` to `app.run(host="0.0.0.0", port=5000, debug=False)`
- Flask backend now bindsto all network interfaces instead of localhost only

### 3. **Environment Configuration** (`.env.local`)
- Added detailed instructions for configuring VITE_API_URL for mobile access

## How to Use It

### For Desktop Testing (Localhost)
Keep the default setting in `.env/` (already configured):
```
VITE_API_URL=http://localhost:5000
```

### For Mobile Device Testing

#### Step 1: Find Your Computer's Local IP Address

**Windows:**
1. Open Command Prompt (`Win + R` → type `cmd`)
2. Run: `ipconfig`
3. Look for "IPv4 Address" (usually format: 192.168.x.x or 10.x.x.x)
4. Note this address (e.g., `192.168.1.100`)

**Mac:**
1. Open Terminal
2. Run: `ifconfig`
3. Look for "inet" address under `en0` or `en1`

**Linux:**
1. Open Terminal
2. Run: `hostname -I`

#### Step 2: Update Environment Variable
Edit `frontend/.env.local` and replace `localhost` with your IP:

```bash
# Example (use YOUR actual IP):
VITE_API_URL=http://192.168.1.100:5000
```

#### Step 3: Start Both Servers

**Terminal 1 - Backend (from project root):**
```bash
python app.py
# Flask will start on http://0.0.0.0:5000
```

**Terminal 2 - Frontend (from frontend folder):**
```bash
npm run dev
# Vite will start on http://0.0.0.0:5173
```

#### Step 4: Access from Mobile
Open your mobile browser and navigate to:
```
http://YOUR_LOCAL_IP:5173
```

Example: `http://192.168.1.100:5173`

## Troubleshooting

### "Cannot connect to backend" error on mobile

1. **Verify servers are running:**
   - Backend: `python app.py` shows "Running on http://0.0.0.0:5000"
   - Frontend: `npm run dev` shows "Local: http://0.0.0.0:5173"

2. **Verify IP address is correct:**
   - Re-run `ipconfig` (Windows) or `ifconfig` (Mac) to confirm your IP
   - Make sure you're using IPv4 address, not IPv6

3. **Check firewall:**
   - Windows Defender Firewall might block ports 5000/5173
   - Allow Python and Node.js through your firewall if prompted

4. **Verify mobile device is on same network:**
   - Mobile device must be connected to same WiFi as your computer
   - Guest networks may not allow local IP access

5. **Test connectivity:**
   - From mobile browser, try: `http://YOUR_LOCAL_IP:5000/`
   - Should see: `{"status": "ok", "message": "Word Record Generator API is running"}`

### Vite HMR connection errors
These warnings are normal during local development and don't affect functionality.

## Switching Between Desktop and Mobile

If you need to switch:

**To Desktop:**
```env
VITE_API_URL=http://localhost:5000
```

**To Mobile:**
```env
VITE_API_URL=http://192.168.1.100:5000  # Replace with your IP
```

Then restart the Vite dev server for changes to take effect.

## Production Deployment Notes

When deploying to Render + Vercel:
- Render automatically sets environment variables from config
- Vercel uses the `VITE_API_URL` you set in its environment variables
- No changes needed to code — configuration is environment-aware
- Both servers will use their public URLs (e.g., `https://your-app-render.com`)

---

**Your backend and frontend are now configured for full mobile network access!**
