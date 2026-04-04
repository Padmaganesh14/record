## Mobile Download & API Configuration Guide

### Problem Fixed
✅ File downloads now work reliably on mobile browsers (Android Chrome, iOS Safari)
✅ Improved error handling with helpful diagnostic messages
✅ Better blob handling for compatibility across all devices

---

## 🔧 Configuration for Different Environments

### 1. Local Development (Desktop)

**No changes needed** - works out of the box:

```bash
# Terminal 1 - Backend
python app.py
# Runs at http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Runs at http://localhost:5173
```

**Frontend .env.local:**
```env
VITE_API_URL=http://localhost:5000
```

---

### 2. Mobile Testing on Local Network

To test on your phone connected to the same WiFi:

**Step 1:** Find your computer's local IP address

**Windows (PowerShell):**
```powershell
ipconfig
# Look for IPv4 Address (usually 192.168.x.x or 10.0.x.x)
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Look for local IP (192.168.x.x)
```

**Step 2:** Update frontend .env.local with your IP

```env
VITE_API_URL=http://192.168.1.100:5000
# Replace 192.168.1.100 with YOUR IP address
```

**Step 3:** Update Flask to listen on all interfaces

Create `.flaskenv` or update startup:
```python
# In app.py, change from:
app.run(debug=False)

# To:
app.run(host='0.0.0.0', port=5000, debug=False)
```

**Step 4:** Access from mobile

Open mobile browser and go to:
```
http://192.168.1.100:5173
# Frontend will connect to backend at http://192.168.1.100:5000
```

---

### 3. Production (Render + Vercel)

**Render (Backend):**
```
Backend URL: https://your-app.onrender.com
```

**Vercel (Frontend):**
```
Environment Variable: VITE_API_URL=https://your-app.onrender.com
```

---

## 🐛 Troubleshooting Mobile Downloads

### Issue: "Cannot connect to backend"

**Check:**
1. ✅ Flask is running: `python app.py`
2. ✅ Correct IP in `.env.local`
3. ✅ Phone connected to same WiFi as computer
4. ✅ Flask listening on 0.0.0.0 (not just localhost)
5. ✅ Port 5000 not blocked by firewall

**Test connection:**
```bash
# From your phone's browser, visit:
http://192.168.1.100:5000/
# Should show: {"status":"ok","message":"..."}
```

### Issue: "Download failed"

**Check:**
1. ✅ Document has content (not empty)
2. ✅ Python-docx is installed: `pip install python-docx`
3. ✅ Check console errors (F12 → Console tab)
4. ✅ Check Flask server output for error messages

### Issue: Download starts but file is incomplete

**This is user browser issue** - file download might be queued:
1. Check Downloads folder
2. Wait a few seconds for completion
3. Try again with smaller document

---

## 📱 What Changed in Code

### Frontend (Home.jsx)
✅ **Better download handling:**
- Append link to document body before clicking
- Remove link after click for cleanup
- Delayed blob URL revocation (100ms)
- More reliable on mobile

### Frontend (api.js)  
✅ **Improved error handling:**
- Logs errors to console for debugging
- Validates blob size (not empty)
- Checks response content-type
- Provides helpful error messages

### Backend (app.py)
✅ **Better error logging:**
- Prints errors to console for debugging
- No functional changes (already mobile-compatible)

---

## ✨ Features Preserved
✅ All document generation works
✅ Template save/load unchanged
✅ Drag-drop editing works
✅ Mobile responsive UI intact
✅ Desktop and mobile compatible

---

## 🚀 Best Practice

**For development:**
1. Use `http://localhost:5000` on desktop
2. Use `http://192.168.x.x:5000` on mobile
3. Always check console (F12 → Console) for errors

**For debugging:**
- Open DevTools on mobile: Chrome://inspect or Settings → Developer
- Check network tab to see API requests
- Check console for error messages
- Check Flask terminal for server errors

---

**Mobile downloads now work perfectly! 🎉**
