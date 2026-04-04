import { Type, Image as ImageIcon, Heading1, Navigation, Table as TableIcon, Settings, Scissors } from 'lucide-react';

export default function Sidebar({ addBlock, onOpenSettings, isMobile }) {
  const blocks = [
    { type: 'heading', label: 'Heading', icon: Heading1 },
    { type: 'text', label: 'Text', icon: Type },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'table', label: 'Table', icon: TableIcon },
    { type: 'pagebreak', label: 'Page Break', icon: Scissors },
    { type: 'footer', label: 'Footer', icon: Navigation },
  ];

  if (isMobile) {
    return (
      <div className="flex w-full justify-around items-center h-full px-2">
        {blocks.map((btn) => (
          <button
            key={btn.type}
            onClick={() => addBlock(btn.type)}
            className="flex flex-col items-center gap-1 p-2 text-gray-500 active:text-blue-600 transition-colors"
          >
            <btn.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{btn.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto hidden lg:flex flex-col">
      <h2 className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Elements</h2>
      <div className="grid grid-cols-1 gap-2 mb-6">
        {blocks.map((btn) => (
          <button
            key={btn.type}
            onClick={() => addBlock(btn.type)}
            className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium text-gray-700 transition duration-200 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600">
              <btn.icon className="h-5 w-5" />
            </div>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4 mt-2" />

      {/* Document Settings Button */}
      <button
        onClick={onOpenSettings}
        className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200 border-blue-200"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Settings className="h-5 w-5" />
        </div>
        Document Settings
      </button>
    </div>
  );
}
