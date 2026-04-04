# Deployment Guide

This guide explains how to deploy the Word Record Generator to Render (backend) and Vercel (frontend).

## Backend Deployment (Flask on Render)

### Prerequisites
- Render account (https://render.com)
- GitHub repository with this code

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Fix project structure for deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Log in to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `word-record-generator-api` (or your choice)
     - **Environment**: `Python`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`
     - **Plan**: Free tier or upgrade as needed

3. **Wait for Deployment**
   - Render will automatically deploy when you push to your branch
   - Your backend URL will be: `https://your-service-name.onrender.com`

4. **Verify**
   - Visit `https://your-service-name.onrender.com/` → should return JSON status

---

## Frontend Deployment (React on Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository

### Steps

1. **Update Environment Variable**
   - Open `frontend/.env.production`
   - Replace `https://your-render-backend.onrender.com` with your actual Render backend URL
   - Example: `VITE_API_URL=https://word-record-generator-api.onrender.com`

2. **Deploy on Vercel**
   - Log in to Vercel dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the project root
   - Configure:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build` (auto-detected)
     - **Output Directory**: `dist` (auto-detected)
     - **Root Directory**: `frontend` (important!)

3. **Set Environment Variables**
   - In Vercel project settings → "Environment Variables"
   - Add: `VITE_API_URL=https://your-render-backend.onrender.com`
   - Apply to all environments (Production, Preview, Development)

4. **Wait for Deployment**
   - Vercel will automatically deploy
   - Your frontend URL will be provided

5. **Verify**
   - Visit your Vercel URL
   - Test the application

---

## Local Development

### Backend
```bash
pip install -r requirements.txt
python app.py
```
API runs at `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` (or displays in terminal)

---

## Troubleshooting

### Backend Issues
- **`Module not found` errors**: Run `pip install -r requirements.txt`
- **`gunicorn` not found**: Ensure `gunicorn` is in requirements.txt
- **CORS errors**: Already enabled in `app.py` with `CORS(app)`

### Frontend Issues
- **API calls failing**: Verify `VITE_API_URL` environment variable is set correctly
- **Environment variable not loading**: Rebuild with `npm run build`
- **Build fails**: Clear `node_modules/` and `.vite/`, then `npm install`

### Environment Variables Not Working
- **Frontend**: Environment variables must be prefixed with `VITE_` to be exposed to the browser
- **Check**: `import.meta.env.VITE_API_URL` in code should correspond to `.env` file

---

## Project Structure

```
.
├── app.py                          # Flask API
├── requirements.txt                # Python dependencies
├── Procfile                        # Render/Heroku config
├── Procfile.render                 # Optional: Render-specific config
├── templates.json                  # Stored templates
├── frontend/
│   ├── .env                        # Local environment
│   ├── .env.production             # Production environment
│   ├── .env.example                # Template
│   ├── vercel.json                 # Vercel config
│   ├── vite.config.js              # Vite config
│   ├── package.json                # Frontend dependencies
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       ├── components/
│       └── services/api.js         # API calls
└── README.md                       # Original readme
```

---

## API Endpoints

- `GET /` - Health check
- `POST /generate` - Generate and download Word document
- `POST /save_template` - Save template
- `GET /load_template/<code>` - Load template by code
- `GET /list_templates` - List all templates
- `DELETE /delete_template/<code>` - Delete template

---

## Notes

- Backend stores templates in `templates.json` (local file storage)
- Generated Word files are saved to `/tmp` (temporary directory)
- CORS is enabled for all routes to allow frontend communication
- Frontend uses `VITE_API_URL` environment variable for API base URL
