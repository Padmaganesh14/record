import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import { saveTemplate, loadTemplate, generateDoc } from '../services/api';

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [settings, setSettings] = useState({
    watermarkText: '',
    enableBorder: true,
    layout: 'normal'
  });
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Ref for settings panel to enable scroll-to-focus
  const settingsPanelRef = useRef(null);

  // Open/focus document settings panel
  const onOpenSettings = () => {
    if (settingsPanelRef.current) {
      settingsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      settingsPanelRef.current.focus();
    }
  };

  // Add a new block to the document
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      props: {
        fontSize: type === 'heading' ? 24 : 16,
        fontFamily: 'Calibri, sans-serif',
        bold: type === 'heading',
        alignment: 'left',
        italic: false,
        underline: false,
        color: '#1e293b',
        lineHeight: 1.5,
        marginTop: 0,
        marginBottom: 16
      }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Update a block's properties
  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  // Remove a block from the document
  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  // Duplicate an existing block
  const duplicateBlock = (id) => {
    const original = blocks.find(b => b.id === id);
    if (!original) return;
    const clone = JSON.parse(JSON.stringify(original));
    clone.id = Date.now().toString();
    setBlocks([...blocks, clone]);
  };

  // Move a block up or down in the document
  const moveBlock = (id, direction) => {
    const idx = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  // Save template to server
  const onSave = async () => {
    if (blocks.length === 0) {
      alert('Add some content before saving');
      return;
    }
    setIsProcessing(true);
    try {
      const data = {
        headings: blocks,
        border: settings.enableBorder,
        watermark: settings.watermarkText,
        layout: settings.layout,
        heading_count: blocks.length
      };
      const result = await saveTemplate(data);
      if (result.success) {
        alert(`✓ Template saved!\n\nRetrieval Code:\n${result.code}\n\nSave this code to load your template later.`);
      } else {
        alert('Failed to save template');
      }
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load template from JSON file
  const onLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      setIsProcessing(true);
      try {
        const fileContent = await file.text();
        const data = JSON.parse(fileContent);
        
        // Validate JSON structure
        if (!data.blocks || !data.settings) {
          throw new Error('Invalid JSON format. Must contain "blocks" and "settings" properties.');
        }
        
        // Load blocks and settings
        setBlocks(data.blocks || []);
        setSettings({
          watermarkText: data.settings.watermarkText || '',
          enableBorder: data.settings.enableBorder !== undefined ? data.settings.enableBorder : true,
          layout: data.settings.layout || 'normal'
        });
        
        alert('✓ Template loaded successfully from file');
      } catch (e) {
        alert('Load failed: ' + (e instanceof SyntaxError ? 'Invalid JSON file' : e.message));
      } finally {
        setIsProcessing(false);
      }
    };
    
    input.click();
  };

  // Download document as Word file
  const onDownload = async () => {
    if (blocks.length === 0) {
      alert('Add some content before downloading');
      return;
    }
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('border', settings.enableBorder ? 'on' : '');
      formData.append('watermark', settings.watermarkText);
      formData.append('layout', settings.layout);

      // Transform blocks for backend
      const backendHeadings = blocks.map(b => ({
        type: b.type,
        text: b.content || '',
        size: b.props.fontSize,
        font: b.props.fontFamily.split(',')[0],
        bold: b.props.bold,
        spacing: 1,
        content: b.type === 'image' ? b.content : undefined
      }));
      formData.append('headings', JSON.stringify(backendHeadings));

      const blob = await generateDoc(formData);
      
      // Mobile-compatible download approach
      const fileName = 'record.docx';
      
      // Method 1: Create blob URL and use anchor element (works on all browsers)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      // Append to document, click, then remove (more reliable on mobile)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup blob URL after a slight delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      console.log('✓ Document generated successfully');
    } catch (e) {
      console.error('Download error:', e);
      alert('Download failed: ' + (e.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 text-slate-800 font-sans select-none overflow-hidden">
      {/* Navigation Bar */}
      <Navbar
        onSave={onSave}
        onLoad={onLoad}
        onDownload={onDownload}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        isProcessing={isProcessing}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Desktop Only */}
        <Sidebar addBlock={addBlock} onOpenSettings={onOpenSettings} />

        {/* Main Editor */}
        <main className="flex-1 flex flex-col min-w-0 relative h-full">
          <div className="flex-1 overflow-y-auto p-4 lg:p-12 scroll-smooth pb-32 lg:pb-12">
            <Editor
              blocks={blocks}
              settings={settings}
              setSettings={setSettings}
              settingsPanelRef={settingsPanelRef}
              showMobileSettings={showMobileSettings}
              setShowMobileSettings={setShowMobileSettings}
              isPreview={isPreview}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={updateBlock}
              onRemoveBlock={removeBlock}
              onDuplicateBlock={duplicateBlock}
              onMoveBlock={moveBlock}
            />
          </div>

          {/* Mobile Toolbar */}
          <div className="lg:hidden shrink-0 bg-white border-t border-gray-100 p-1 flex justify-around items-center pb-[5.5rem] z-30">
            <Sidebar addBlock={addBlock} isMobile={true} />
          </div>
        </main>
      </div>

      {/* Mobile Download Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <button
          onClick={onDownload}
          disabled={blocks.length === 0 || isProcessing}
          className={`
            w-full py-4 rounded-3xl bg-blue-600 text-white font-bold text-sm shadow-2xl shadow-blue-500/30
            active:scale-95 transition-all flex items-center justify-center gap-3
            ${(blocks.length === 0 || isProcessing) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {isProcessing ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>📄 Generate Document</>
          )}
        </button>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center p-8 bg-white rounded-[2.5rem] shadow-2xl border border-white">
            <div className="h-14 w-14 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">Processing...</p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Do not refresh</p>
          </div>
        </div>
      )}
    </div>
  );
}
