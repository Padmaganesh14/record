# Deployment Checklist for Render + Vercel

This checklist ensures your Word Record Generator is properly configured for production deployment.

## ✅ Backend Configuration (Render)

### 1. Procfile - Production Server Start
```
web: gunicorn app:app
```
✅ **Status:** Configured
- Uses Gunicorn (production-grade WSGI server)
- Does NOT use `app.run()` (local development only)
- Entry point: `app:app` (module:Flask instance)

### 2. requirements.txt - All Dependencies
```
flask==2.3.3
python-docx==0.8.11
flask-cors==4.0.0
gunicorn==21.2.0
```
✅ **Status:** Complete
- ✅ Flask (web framework)
- ✅ python-docx (Word document generation)
- ✅ flask-cors (Cross-Origin requests)
- ✅ gunicorn (Production server)

### 3. Temp File Handling - Cross-Platform
In `app.py` line 141:
```python
filepath = os.path.join(tempfile.gettempdir(), filename)
```
✅ **Status:** Correct
- Uses `tempfile.gettempdir()` ✓ Works on Render's Linux servers
- ❌ Would FAIL if hardcoded to `"/tmp"` or `"./temp"`
- ✓ Compatible with cloud deployments

### 4. Flask App Configuration
In `app.py` lines 201-204:
```python
if __name__ == "__main__":
    # Bind to 0.0.0.0 for mobile network access
    app.run(host="0.0.0.0", port=5000, debug=False)
```
✅ **Status:** Correct for local development
- ⚠️ Note: This code is NOT used on Render
- On Render: Gunicorn automatically starts the app
- On local: Enables mobile device testing

### 5. CORS Configuration
In `app.py` line 16:
```python
CORS(app)
```
✅ **Status:** Enabled
- Allows frontend (Vercel) to make requests to backend (Render)
- Required for cross-origin deployments

### 6. JSON Template Storage
- File: `templates.json` (auto-created on first use)
- Created and managed by `save_templates_to_file()` / `load_templates()`
✅ **Status:** Configured
- Stores template data locally on the Render instance
- Survives dyno restarts on Render's paid plans
- ⚠️ Note: Templates are lost if using Render's free tier (dyno sleeps after 15 min inactivity)

### 7. Deleted Conflicting Files
- ❌ `render.yaml` - Deleted (was redundant, Procfile is sufficient)

---

## ✅ Frontend Configuration (Vercel)

### 1. Environment Variables Setup

**For Local Development:** `.env.local`
```
VITE_API_URL=http://localhost:5000
```
✅ **Status:** Configured (for mobile/local IP testing)

**For Production Build:** `.env.production`
```
VITE_API_URL=https://your-render-backend.onrender.com
```
✅ **Status:** Configured
- Must be replaced with your actual Render URL when deployed

**Example:** `.env.example`
```
VITE_API_URL=http://localhost:5000
```
✅ **Status:** Documented

### 2. API Base URL Configuration
In `frontend/src/services/api.js` line 2:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```
✅ **Status:** Correct
- Reads from `import.meta.env.VITE_API_URL` ✓
- Fallback to localhost for development ✓
- ❌ NO hardcoded URLs ✓

### 3. All API Calls Use Environment Variable
Examples:
- `fetch(\`${API_URL}/generate\`)` ✓
- `fetch(\`${API_URL}/save_template\`)` ✓
- `fetch(\`${API_URL}/list_templates\`)` ✓

✅ **Status:** Verified in `api.js`

### 4. Vite Configuration
In `frontend/vite.config.js`:
```javascript
server: {
  port: 5173,
  host: true, // Accessible on local network
  proxy: {
    '/api': {
      target: process.env.VITE_API_URL || 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```
✅ **Status:** Configured for mobile/network access

### 5. Production Build Output
```
outDir: 'dist'
```
✅ **Status:** Configured
- Vercel automatically detects and deploys the `dist/` folder

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Name:** word-record-generator (or your choice)
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Python Version:** 3.11 (or higher)
5. Click **Deploy**
6. Note your URL: `https://word-record-generator.onrender.com`

### Step 2: Update Frontend Environment
1. Update `.env.production` with your Render URL:
   ```
   VITE_API_URL=https://word-record-generator.onrender.com
   ```
2. Commit and push to GitHub

### Step 3: Deploy Frontend to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Select project root: `frontend/`
4. Vercel auto-detects Vite configuration
5. Env variables: Add `VITE_API_URL`
   - **Key:** `VITE_API_URL`
   - **Value:** `https://word-record-generator.onrender.com`
6. Click **Deploy**
7. Your app is live at `https://your-project.vercel.app`

---

## 🔗 API Endpoint Testing

Test your backend with:
```bash
# Health check (should return 200)
curl https://word-record-generator.onrender.com/

# Expected response:
# {"status": "ok", "message": "Word Record Generator API is running"}
```

---

## 🚀 Project Structure

```
project/
├── app.py                 # Flask backend (Render deploys this)
├── requirements.txt       # Python dependencies
├── Procfile              # Render deployment config
├── templates.json        # Auto-generated template storage
├── templates/            # HTML templates (not used in API mode)
├── frontend/             # React + Vite (Vercel deploys this)
│   ├── package.json
│   ├── vite.config.js
│   ├── .env              # (optional)
│   ├── .env.local        # Local development
│   ├── .env.production   # Production (Vercel uses this)
│   ├── .env.example      # Documentation
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Editor.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Block.jsx
│   │   └── services/
│   │       └── api.js    # Uses VITE_API_URL env var
│   └── dist/             # Build output (deployed to Vercel)
├── DEPLOYMENT.md         # Original deployment guide
├── SETUP.md              # Setup instructions
├── MOBILE_NETWORK_SETUP.md  # Local network testing
└── DEPLOYMENT_CHECKLIST.md  # This file
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot reach backend" on Vercel frontend

**Cause:** API URL not configured in Vercel environment variables
**Fix:**
1. Go to Vercel project settings → Environment Variables
2. Add: `VITE_API_URL=https://your-render-url.onrender.com`
3. Redeploy

### Issue: CORS error: "Access to fetch blocked"

**Cause:** Flask missing CORS configuration
**Fix:** Ensure `app.py` has:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # This line enables cross-origin requests
```
✅ Already configured

### Issue: "503 Service Unavailable" on Render free tier

**Cause:** Dyno went to sleep (free tier spins down after 15 min inactivity)
**Fix:** Upgrade to paid plan or add health check endpoint
✅ Already has `/` health check endpoint

### Issue: File download returns empty .docx

**Cause:** API returns wrong content-type header
**Fix:** Ensure app.py uses proper MIME type:
```python
return send_file(
    filepath,
    as_attachment=True,
    download_name="record.docx",
    mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)
```
✅ Already configured

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Flask Docs:** https://flask.palletsprojects.com/
- **Vite Docs:** https://vitejs.dev/
- **python-docx Docs:** https://python-docx.readthedocs.io/

---

## ✅ Final Checklist

- [x] `render.yaml` deleted (conflicts removed)
- [x] `requirements.txt` complete with all dependencies
- [x] `app.py` uses `tempfile.gettempdir()` for cross-platform support
- [x] `Procfile` correctly configured with `gunicorn app:app`
- [x] `.env.production` set up with Render URL placeholder
- [x] `api.js` uses `import.meta.env.VITE_API_URL`
- [x] All API calls use environment variable (no hardcoded URLs)
- [x] CORS enabled in Flask backend
- [x] Mobile network configuration available in separate guide
- [x] Project structure clean and deployment-ready

**Your project is ready for production deployment!**
