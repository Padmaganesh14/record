import { Image, Trash2, UploadCloud } from 'lucide-react';

export default function ImageUploader({ content, onUpload, onClear, isPreview }) {
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpload(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (content) {
    return (
      <div className="relative group/img max-w-full inline-block">
        <img 
          src={content} 
          alt="Uploaded" 
          className="max-w-full h-auto rounded-2xl shadow-sm border border-gray-100"
        />
        {!isPreview && (
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur shadow-xl rounded-xl text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover/img:opacity-100 hover:scale-110 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label 
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-500', 'bg-blue-50/50'); }}
      onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/50'); }}
      onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/50'); handleImageChange(e); }}
      className={`
        w-full flex flex-col items-center justify-center p-8 lg:p-12 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/30 
        hover:border-blue-300 hover:bg-blue-50/10 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group
      `}
    >
      <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-[1.5rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
         <UploadCloud className="h-7 w-7 lg:h-8 lg:w-8" />
      </div>
      <h3 className="text-xs lg:text-sm font-black text-gray-900 mb-1 tracking-tight text-center px-4">Click or drag image here</h3>
      <p className="text-[9px] lg:text-[10px] uppercase font-black tracking-widest text-gray-400 opacity-60 italic">PNG, JPG, JPEG (Max 10MB)</p>
      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
    </label>
  );
}
