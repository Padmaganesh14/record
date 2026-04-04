import { 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  X, Trash2, Plus, Minus, MoveVertical, Smartphone, Monitor, Palette, Settings2
} from 'lucide-react';

export default function PropertiesPanel({ selectedBlock, onUpdateBlock, settings, setSettings, onClose }) {
  const handlePropChange = (key, value) => {
    if (!selectedBlock) return;
    onUpdateBlock(selectedBlock.id, { 
      props: { ...selectedBlock.props, [key]: value } 
    });
  };

  const fonts = ['Inter, sans-serif', 'Roboto, sans-serif', 'Outfit, sans-serif', 'Playfair Display, serif', 'JetBrains Mono, monospace'];

  return (
    <div className="flex-1 overflow-y-auto bg-white p-5 space-y-10 selection:bg-blue-50 hide-scrollbar pb-32">
      <div className="lg:hidden flex items-center justify-between pt-2">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">Properties</h3>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
          <X className="h-5 w-5" />
        </button>
      </div>

      {selectedBlock ? (
        <div className="animate-in fade-in slide-in-from-right duration-300">
           <div className="flex items-center gap-3 mb-6">
             <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Settings2 className="h-5 w-5" />
             </div>
             <div>
                <h2 className="text-sm font-bold text-gray-900 capitalize">{selectedBlock.type} Block</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Customization</p>
             </div>
           </div>

           {/* Typography section */}
           {(selectedBlock.type === 'heading' || selectedBlock.type === 'text' || selectedBlock.type === 'footer') && (
             <section className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">Typography</label>
                  <select 
                    value={selectedBlock.props.fontFamily}
                    onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  >
                    {fonts.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">Size ({selectedBlock.props.fontSize}px)</label>
                    <input 
                      type="range" min="8" max="72" 
                      value={selectedBlock.props.fontSize}
                      onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">Color</label>
                    <div className="flex items-center gap-2">
                       <input 
                        type="color" 
                        value={selectedBlock.props.color}
                        onChange={(e) => handlePropChange('color', e.target.value)}
                        className="h-10 w-12 rounded-lg border-0 p-0 cursor-pointer overflow-hidden" 
                      />
                      <span className="text-xs font-mono text-gray-400">{selectedBlock.props.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                   <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">Style & Align</label>
                   <div className="flex flex-wrap gap-2">
                      <div className="flex border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                        <button onClick={() => handlePropChange('bold', !selectedBlock.props.bold)} className={`p-2 rounded-lg transition-all ${selectedBlock.props.bold ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>B</button>
                        <button onClick={() => handlePropChange('italic', !selectedBlock.props.italic)} className={`p-2 rounded-lg transition-all ${selectedBlock.props.italic ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>I</button>
                        <button onClick={() => handlePropChange('underline', !selectedBlock.props.underline)} className={`p-2 rounded-lg transition-all ${selectedBlock.props.underline ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>U</button>
                      </div>
                      <div className="flex border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                        <button onClick={() => handlePropChange('alignment', 'left')} className={`p-2 rounded-lg transition-all ${selectedBlock.props.alignment === 'left' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><AlignLeft className="h-4 w-4" /></button>
                        <button onClick={() => handlePropChange('alignment', 'center')} className={`p-2 rounded-lg transition-all ${selectedBlock.props.alignment === 'center' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><AlignCenter className="h-4 w-4" /></button>
                        <button onClick={() => handlePropChange('alignment', 'right')} className={`p-2 rounded-lg transition-all ${selectedBlock.props.alignment === 'right' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><AlignRight className="h-4 w-4" /></button>
                      </div>
                   </div>
                </div>
             </section>
           )}

           {/* Table section */}
           {selectedBlock.type === 'table' && (
              <section className="space-y-6 animate-in slide-in-from-top duration-300">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2.5">Configure Table</label>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500">Rows</span>
                      <div className="flex items-center gap-1 border border-gray-100 p-1 rounded-xl bg-gray-50/50">
                         <button onClick={() => handlePropChange('rows', Math.max(1, selectedBlock.props.rows - 1))} className="p-1 px-2 hover:bg-white rounded-lg transition-all text-xs font-bold text-gray-400">-</button>
                         <span className="flex-1 text-center text-xs font-bold">{selectedBlock.props.rows}</span>
                         <button onClick={() => handlePropChange('rows', selectedBlock.props.rows + 1)} className="p-1 px-2 hover:bg-white rounded-lg transition-all text-xs font-bold text-gray-400">+</button>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500">Cols</span>
                      <div className="flex items-center gap-1 border border-gray-100 p-1 rounded-xl bg-gray-50/50">
                         <button onClick={() => handlePropChange('cols', Math.max(1, selectedBlock.props.cols - 1))} className="p-1 px-2 hover:bg-white rounded-lg transition-all text-xs font-bold text-gray-400">-</button>
                         <span className="flex-1 text-center text-xs font-bold">{selectedBlock.props.cols}</span>
                         <button onClick={() => handlePropChange('cols', selectedBlock.props.cols + 1)} className="p-1 px-2 hover:bg-white rounded-lg transition-all text-xs font-bold text-gray-400">+</button>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                   <label className="text-xs font-bold text-gray-600">Visible Borders</label>
                   <input type="checkbox" checked={selectedBlock.props.border} onChange={(e) => handlePropChange('border', e.target.checked)} className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
              </section>
           )}

           {/* Layout & Metrics */}
           {selectedBlock.type !== 'divider' && selectedBlock.type !== 'pagebreak' && (
             <section className="pt-8 mt-8 border-t border-gray-100 space-y-6">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Layout & Metrics</label>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500">Margin Top</span>
                      <input type="number" value={selectedBlock.props.marginTop} onChange={(e) => handlePropChange('marginTop', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-100 rounded-xl bg-gray-50/50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                   <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500">Margin Bottom</span>
                      <input type="number" value={selectedBlock.props.marginBottom} onChange={(e) => handlePropChange('marginBottom', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-100 rounded-xl bg-gray-50/50 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
             </section>
           )}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-500 space-y-10">
          <div className="p-6 rounded-3xl bg-slate-50 flex flex-col items-center text-center">
             <div className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-600 mb-6">
                <Monitor className="h-6 w-6" />
             </div>
             <h2 className="text-sm font-bold text-gray-900 mb-2">Document Settings</h2>
             <p className="text-xs text-gray-400">Configure global document parameters</p>
          </div>

          <section className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-2 block">Visual Content</label>
              <div className="space-y-3">
                 {/* Header Settings */}
                 <div className="p-4 rounded-2xl border border-gray-100 space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-gray-700">Enable Header</label>
                     <input type="checkbox" checked={settings.enableHeader} onChange={(e) => setSettings({ enableHeader: e.target.checked })} className="h-5 w-5 rounded-md border-gray-300 text-blue-600" />
                   </div>
                   {settings.enableHeader && (
                     <input type="text" placeholder="Header text..." value={settings.headerText} onChange={(e) => setSettings({ headerText: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                   )}
                 </div>

                 {/* Watermark Settings */}
                 <div className="p-4 rounded-2xl border border-gray-100 space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-gray-700">Enable Watermark</label>
                     <input type="checkbox" checked={settings.enableWatermark} onChange={(e) => setSettings({ enableWatermark: e.target.checked })} className="h-5 w-5 rounded-md border-gray-300 text-blue-600" />
                   </div>
                   {settings.enableWatermark && (
                     <div className="space-y-4">
                       <input type="text" placeholder="Watermark text..." value={settings.watermarkText} onChange={(e) => setSettings({ watermarkText: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 outline-none" />
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400">Opacity ({Math.round(settings.watermarkOpacity * 100)}%)</label>
                          <input type="range" min="0" max="0.5" step="0.01" value={settings.watermarkOpacity} onChange={(e) => setSettings({ watermarkOpacity: parseFloat(e.target.value) })} className="w-full accent-blue-600" />
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-2 block">Document Layout</label>
              <div className="p-1 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-1">
                 {['narrow', 'normal', 'wide'].map(mode => (
                   <button 
                     key={mode}
                     onClick={() => setSettings({ layout: mode })}
                     className={`py-2 text-[10px] font-bold rounded-xl uppercase tracking-widest transition-all ${settings.layout === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
