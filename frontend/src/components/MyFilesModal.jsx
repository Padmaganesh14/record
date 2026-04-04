import { X, Search, FileText, Trash2, Calendar, Layout, Hash, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MyFilesModal({ isOpen, onClose, onLoadFile }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) fetchFiles();
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/list_templates');
      const data = await response.json();
      if (data.success) setFiles(data.templates);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteFile = async (code) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await fetch(`/api/delete_template/${code}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) fetchFiles();
    } catch (e) { console.error(e); }
  };

  const filteredFiles = files.filter(f => 
    f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.watermark?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in duration-300 max-h-[85vh]">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Documents</h2>
            <p className="text-xs text-gray-400 font-medium">Browse and manage your saved records</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by code or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
            />
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-gray-100 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading your files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center p-10">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                   <FileText className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-gray-500 mb-1">No documents found</p>
                <p className="text-xs">Start creating and saving your records to see them here.</p>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div 
                  key={file.code}
                  className="group flex items-center justify-between p-4 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                        <FileText className="h-6 w-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{file.code}</span>
                          <h3 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.watermark || 'Untitled Document'}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {file.heading_count} Blocks</span>
                           <span className="flex items-center gap-1"><Layout className="h-3 w-3" /> {file.layout}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onLoadFile(file.code)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                    >
                      Open <ArrowUpRight className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => deleteFile(file.code)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-center border-t border-gray-100">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved in local storage (templates.json)</p>
        </div>
      </div>
    </div>
  );
}
