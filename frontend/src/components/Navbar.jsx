import { Download, Save, FolderOpen } from 'lucide-react';

export default function Navbar({ onDownload, onSave, onLoad, isPreview, setIsPreview, isProcessing }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 lg:px-6 py-2.5 lg:py-3 shadow-sm border-b border-gray-100">
      {/* Logo and Branding */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg">
          R
        </div>
        <h1 className="hidden sm:block text-lg font-bold text-gray-900">RecordGen</h1>
      </div>

      {/* Edit / Preview Toggle */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
        <button
          onClick={() => setIsPreview(false)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
            !isPreview ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setIsPreview(true)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
            isPreview ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={onSave}
          title="Save template (Ctrl+S)"
          className="hidden lg:flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-95"
        >
          <Save className="h-3.5 w-3.5" /> Save
        </button>

        <button
          onClick={onLoad}
          className="hidden lg:flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-95"
        >
          <FolderOpen className="h-3.5 w-3.5" /> Load
        </button>

        <button
          onClick={onDownload}
          disabled={isProcessing}
          className="flex items-center gap-1.5 lg:gap-2 rounded-full lg:rounded-lg bg-blue-600 px-4 lg:px-5 py-2 text-xs lg:text-sm font-bold text-white shadow-blue-500/20 shadow-xl transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> <span className="hidden xs:inline">Export</span>
        </button>
      </div>
    </nav>
  );
}
