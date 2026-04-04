# 📝 RecordGen - Word Document Generator

A modern, full-stack application for generating professional Microsoft Word documents (.docx) with custom content, formatting, and templates. Built with Flask (backend) and React + Vite (frontend).

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)
![React](https://img.shields.io/badge/React-18.3+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **WYSIWYG Editor** - Drag-drop visual document builder
- **Rich Content** - Text, headings, images, tables, dividers
- **Formatting** - Font size, bold, italic, underline, colors, alignment
- **Page Options** - Multiple layouts (Letter, A4, Legal), borders, watermarks
- **Templates** - Save/load documents with unique retrieval codes
- **Live Preview** - Edit/preview modes for accurate WYSIWYG
- **Mobile Friendly** - Responsive design for all devices
- **Image Support** - Upload and embed images directly
- **Cloud Ready** - Deployable on Render (backend) & Vercel (frontend)

## 🚀 Quick Start

### Local Development

**Backend:**
```bash
pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Flask 2.3 + python-docx |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Drag-Drop | @dnd-kit |
| Deployment | Render + Vercel |

## 📋 Project Structure

```
RecordGen/
├── app.py                    # Flask API
├── requirements.txt          # Python deps
├── Procfile                  # Deployment config
├── templates.json            # Template storage
└── frontend/                 # React app
    ├── src/
    │   ├── pages/Home.jsx    # Main page
    │   ├── components/       # UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Editor.jsx
    │   │   └── Block.jsx
    │   └── services/api.js   # API client
    └── .env                  # Config
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/generate` | Generate .docx file |
| POST | `/save_template` | Save document template |
| GET | `/load_template/<code>` | Load template by code |
| GET | `/list_templates` | List all templates |
| DELETE | `/delete_template/<code>` | Delete template |

## 🎨 Components

### Backend (Flask)
- **app.py** - Main Flask application with all routes
- Clean, modular structure
- CORS enabled for frontend communication
- Gunicorn-compatible for production

### Frontend (React)
- **Home.jsx** - Main application logic and state management
- **Navbar.jsx** - Top bar with save/load/export buttons
- **Sidebar.jsx** - Block types for content creation
- **Editor.jsx** - Document canvas with settings panel
- **Block.jsx** - Individual content block with editing
- **api.js** - HTTP client for backend API calls

## 🚢 Deployment

### Deploy Backend (Render.com)
1. Create account on render.com
2. New → Web Service → connect GitHub repo
3. Set build: `pip install -r requirements.txt`
4. Set start: `gunicorn app:app`
5. Deploy!

### Deploy Frontend (Vercel.com)
1. Create account on vercel.com
2. New Project → import GitHub repo (frontend folder)
3. Environment variable: `VITE_API_URL=<your-render-url>`
4. Deploy!

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## 🔑 Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

### Production
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📝 Usage

1. **Add Content** - Click elements in sidebar to add blocks
2. **Edit** - Click blocks in editor to edit inline
3. **Format** - Customize fonts, sizes, colors, borders
4. **Preview** - Toggle preview mode to see final result
5. **Save** - Click "Save" to store template with unique code
6. **Download** - Export as .docx file

## 🛠️ Development

### Install & Setup
```bash
# Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### Run Locally
```bash
# Terminal 1 - Backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🐛 Troubleshooting

**Backend not responding**
- Check port 5000 is available
- Run `python app.py` to see errors
- Verify requirements installed: `pip list`

**Frontend API errors**
- Check `.env.local` has correct `VITE_API_URL`
- Backend must be running
- Check browser DevTools console

**Document generation fails**
- Ensure python-docx is installed
- Check `/tmp` directory exists
- Verify form data is sent correctly

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed installation & deployment
- [Deployment Guide](DEPLOYMENT.md) - Cloud deployment steps
- [Requirements](requirements.txt) - Python dependencies

## 📄 License

MIT License - Feel free to use this project for personal or commercial use.

## 💡 Tips

- Use templates to save time on recurring documents
- Drag blocks to reorder content
- Use watermarks for confidential documents
- Preview mode shows exactly how it will print
- Images are embedded in the .docx file

---

**Built with ❤️ using Flask and React**
