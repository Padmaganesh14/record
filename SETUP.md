# RecordGen - Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### Backend (Flask)

```bash
# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
# Server runs at http://localhost:5000
```

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev
# App runs at http://localhost:5173
```

## 📦 Project Structure

```
RecordGen/
├── app.py                    # Flask backend
├── requirements.txt          # Python dependencies
├── Procfile                  # Gunicorn config (deployment)
├── templates.json            # Template storage
├── templates/                # Flask templates (if needed)
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # Tailwind styles
│   │   ├── pages/
│   │   │   └── Home.jsx     # Main page
│   │   ├── components/
│   │   │   ├── Navbar.jsx   # Navigation bar
│   │   │   ├── Sidebar.jsx  # Block selector
│   │   │   ├── Editor.jsx   # Document editor
│   │   │   └── Block.jsx    # Block renderer
│   │   └── services/
│   │       └── api.js       # API calls
│   ├── .env                 # Env variables (template)
│   ├── .env.local           # Local dev config
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Node dependencies
└── README.md
```

## 🔧 Backend Configuration

### Flask App (`app.py`)
- **Framework**: Flask 2.3.3
- **Database**: Templates stored in `templates.json`
- **File Storage**: Uses `/tmp` directory (Render-compatible)
- **CORS**: Enabled for frontend communication
- **Max Upload**: 200 MB

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/generate` | Generate Word document |
| POST | `/save_template` | Save template |
| GET | `/load_template/<code>` | Load template by code |
| GET | `/list_templates` | List all templates |
| DELETE | `/delete_template/<code>` | Delete template |

### Dependencies (`requirements.txt`)
```
flask==2.3.3
python-docx==0.8.11
flask-cors==4.0.0
gunicorn==21.2.0
```

## 🎨 Frontend Configuration

### API Endpoint
The frontend uses the `VITE_API_URL` environment variable:
- **Local**: `http://localhost:5000`
- **Production**: Your Render backend URL

### Components
- **Navbar**: Navigation, save/load/export buttons, preview toggle
- **Sidebar**: Block types (heading, text, image, table, etc.)
- **Editor**: WYSIWYG document editor with drag-drop
- **Block**: Individual content blocks with inline editing

### Environment Variables
Create `.env.local` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

## 🚢 Deployment

### Deploy Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment:
   - **Build**: `pip install -r requirements.txt`
   - **Start**: `gunicorn app:app`
5. Deploy!

### Deploy Frontend (Vercel)

1. Push code to GitHub (or `frontend/` folder)
2. Create new project on Vercel
3. Set environment variable:
   - `VITE_API_URL=https://your-render-backend-url.onrender.com`
4. Deploy!

## 🔑 Key Features

✅ **Document Generation**
- Create Word documents (.docx) with various content types
- Page borders and watermarks support
- Multiple page layouts (Letter, A4, Legal)

✅ **Template System**
- Save/load templates with unique retrieval codes
- Persistent storage in `templates.json`

✅ **Rich Editing**
- Drag-drop block reordering
- Inline text editing
- Image upload support
- Table creation

✅ **Responsive Design**
- Works on desktop and mobile
- Tailwind CSS styling
- Lucide React icons

## 🐛 Troubleshooting

### Backend Issues

**ModuleNotFoundError**
```bash
pip install -r requirements.txt --upgrade
```

**CORS Errors**
- Backend has CORS enabled
- Check `VITE_API_URL` in frontend `.env`

**File Permission Errors**
- `/tmp` directory is handled by the system
- Gunicorn writes temp files automatically

### Frontend Issues

**API calls failing**
- Verify `VITE_API_URL` environment variable
- Check backend is running on specified port
- Check browser console for detailed errors

**Build errors**
```bash
cd frontend
npm install
npm run build
```

## 📝 Development Notes

- **State Management**: React Context (or lift state to Home.jsx)
- **Styling**: Tailwind CSS + custom CSS
- **Icons**: Lucide React
- **Drag-Drop**: @dnd-kit libraries
- **API Client**: Fetch API with environment variables

## ✨ Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] API URL points to Render backend
- [ ] Templates persist in `templates.json`
- [ ] CORS working correctly
- [ ] Test document generation works
- [ ] Test save/load templates works

---

**Need help?** Check the README.md for feature overview.
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

### Deployment

1. **Backend to Render:**
   - Push to GitHub
   - Connect repo to Render
   - Set build: `pip install -r requirements.txt`
   - Set start: `gunicorn app:app`
   - Deploy automatically

2. **Frontend to Vercel:**
   - Set root directory to `frontend/`
   - Set build command: `npm run build`
   - Add env var: `VITE_API_URL=<your-render-url>`
   - Deploy automatically

## 📁 Final Project Structure

```
.
├── .gitignore
├── app.py                    # Flask API (CLEAN)
├── requirements.txt          # Dependencies with versions
├── Procfile                  # Render/Heroku config
├── render.yaml               # Render specific config
├── DEPLOYMENT.md             # Detailed deployment guide
├── README.md                 # Original project docs
├── templates.json            # Template storage
├── templates/                # Flask templates (if needed)
├── LICENSE
└── frontend/
    ├── .env                  # Local dev environment
    ├── .env.example          # Template for team
    ├── .env.production       # Production template
    ├── vercel.json           # Vercel deployment config
    ├── vite.config.js        # Vite config (UPDATED)
    ├── package.json
    ├── package-lock.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── pages/Home.jsx
    │   ├── components/       # Navbar, Sidebar, Editor, etc.
    │   ├── services/api.js   # API calls (VITE_API_URL ready)
    │   └── ...
    └── node_modules/         # (git ignored)
```

## 🔑 Key Changes Made

1. **Backend**
   - Removed `template_folder` (API only, no server-side rendering)
   - Removed unused imports (`render_template`, `nsmap`)
   - Added health check route (`GET /`)
   - Files use `/tmp` for temporary storage (cloud safe)

2. **Frontend**
   - Fixed `.env` encoding
   - Added production environment setup
   - Vercel deployment config included
   - Vite optimized for production builds

3. **Deployment**
   - Complete guide in `DEPLOYMENT.md`
   - Configuration files for both platforms
   - Environment variable system ready

## ✨ Next Steps

1. **Test locally:**
   ```bash
   # Terminal 1 (Backend)
   python app.py

   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix project structure and add deployment configuration"
   git push origin main
   ```

3. **Deploy to Render:**
   - Follow `DEPLOYMENT.md` Backend section

4. **Deploy to Vercel:**
   - Follow `DEPLOYMENT.md` Frontend section

---

**Status: ✅ Ready for Deployment**
