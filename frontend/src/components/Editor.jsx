import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Block from './Block';
import { useMemo } from 'react';
import { Settings, X } from 'lucide-react';

export default function Editor({
  blocks,
  settings,
  setSettings,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onRemoveBlock,
  onDuplicateBlock,
  onMoveBlock,
  settingsPanelRef,
  showMobileSettings,
  setShowMobileSettings,
  isPreview
}) {
  const blockIds = useMemo(() => blocks.map(b => b.id), [blocks]);

  const handleWatermarkChange = (e) => {
    setSettings({ ...settings, watermarkText: e.target.value });
  };

  const toggleBorder = () => {
    setSettings({ ...settings, enableBorder: !settings.enableBorder });
  };

  return (
    <div className="flex gap-6 relative">
      {/* Mobile Settings Button - Visible only on mobile */}
      <button
        onClick={() => setShowMobileSettings(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700 transition-all"
      >
        <Settings className="h-5 w-5" />
        <span className="text-sm font-semibold">Settings</span>
      </button>

      {/* Main Editor Canvas */}
      <div className="flex-1">
        <div
          className="flex-1 bg-slate-100/50 p-4 lg:p-10 select-none pb-24 lg:pb-10 rounded-lg pl-12 lg:pl-20"
          onClick={() => onSelectBlock(null)}
        >
          <div className="flex flex-col items-center min-h-full py-4 lg:py-8">
            <div
              className={`
                relative bg-white transition-all duration-500 ease-in-out w-full
                ${isPreview ? 'shadow-sm' : 'shadow-2xl ring-1 ring-gray-200'}
              `}
              style={{
                maxWidth: '816px',
                minHeight: '1056px',
                padding: '8%'
              }}
            >
              {/* Page Border */}
              {settings.enableBorder && !isPreview && (
                <div className="absolute inset-0 pointer-events-none border-[2px] border-gray-900 m-8" />
              )}

              {/* Watermark Preview */}
              {settings.watermarkText && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
                  <div
                    className="text-gray-900 font-bold text-center transform -rotate-45 whitespace-nowrap select-none"
                    style={{ opacity: 0.08, fontSize: '100px' }}
                  >
                    {settings.watermarkText}
                  </div>
                </div>
              )}

              {/* Document Content */}
              <div className="flex-1 z-20 relative">
                {blocks.length === 0 ? (
                  <div className="flex h-[400px] flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16 text-gray-200 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-base font-semibold text-gray-400">Start adding content</p>
                    <p className="text-sm text-gray-300 mt-1">Use the sidebar to add blocks</p>
                  </div>
                ) : (
                  <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                    {blocks.map((block) => (
                      <Block
                        key={block.id}
                        block={block}
                        isPreview={isPreview}
                        selected={block.id === selectedBlockId}
                        onSelect={onSelectBlock}
                        onUpdate={onUpdateBlock}
                        onRemove={onRemoveBlock}
                        onDuplicate={onDuplicateBlock}
                        onMove={onMoveBlock}
                      />
                    ))}
                  </SortableContext>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel - Desktop Only */}
      <aside 
        ref={settingsPanelRef} 
        className="hidden lg:flex flex-col w-72 bg-white rounded-lg shadow-sm p-4 border border-gray-100 h-fit sticky top-24"
        tabIndex={-1}
      >
        <h3 className="text-sm font-bold text-gray-900 mb-4">Document Settings</h3>

        {/* Border Toggle */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableBorder}
              onChange={toggleBorder}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Page Border</span>
          </label>
        </div>

        {/* Page Layout */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
          <select
            value={settings.layout}
            onChange={(e) => setSettings({ ...settings, layout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal (Letter)</option>
            <option value="a4">A4</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        {/* Watermark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Watermark</label>
          <input
            type="text"
            value={settings.watermarkText}
            onChange={handleWatermarkChange}
            placeholder="e.g., CONFIDENTIAL"
            maxLength={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-gray-500 mt-1">Text will appear faded in background</p>
        </div>
      </aside>

      {/* Mobile Settings Drawer - Visible only on mobile */}
      {showMobileSettings && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileSettings(false)}
          />

          {/* Bottom Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2">
              <div className="h-1 w-12 rounded-full bg-gray-300" />
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Document Settings</h3>
                <button
                  onClick={() => setShowMobileSettings(false)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Border Toggle */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableBorder}
                    onChange={toggleBorder}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Page Border</span>
                </label>
              </div>

              {/* Page Layout */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Layout</label>
                <select
                  value={settings.layout}
                  onChange={(e) => setSettings({ ...settings, layout: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal (Letter)</option>
                  <option value="a4">A4</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              {/* Watermark */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Watermark</label>
                <input
                  type="text"
                  value={settings.watermarkText}
                  onChange={handleWatermarkChange}
                  placeholder="e.g., CONFIDENTIAL"
                  maxLength={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-500 mt-2">Text will appear faded in background</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowMobileSettings(false)}
                className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
