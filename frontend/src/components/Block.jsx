import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

export default function Block({
  block,
  selected,
  onSelect,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
  isPreview
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: isPreview
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 1
  };

  const handleClick = (e) => {
    if (isPreview) return;
    e.stopPropagation();
    onSelect(block.id);
  };

  const handleUpdate = (e) => {
    onUpdate(block.id, { content: e.currentTarget.textContent });
  };

  const renderContent = () => {
    const baseStyle = {
      fontSize: `${block.props.fontSize}px`,
      fontFamily: block.props.fontFamily,
      fontWeight: block.props.bold ? 'bold' : 'normal',
      fontStyle: block.props.italic ? 'italic' : 'normal',
      textDecoration: block.props.underline ? 'underline' : 'none',
      textAlign: block.props.alignment,
      color: block.props.color || '#1e293b',
      lineHeight: block.props.lineHeight || 1.5,
      marginTop: `${block.props.marginTop || 0}px`,
      marginBottom: `${block.props.marginBottom || 16}px`,
      outline: 'none'
    };

    switch (block.type) {
      case 'heading':
        return (
          <h2
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={handleUpdate}
            className="w-full break-words transition-all duration-300"
            style={baseStyle}
          >
            {block.content || 'Heading...'}
          </h2>
        );

      case 'text':
        return (
          <p
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={handleUpdate}
            className="w-full break-words transition-all duration-300"
            style={baseStyle}
          >
            {block.content || 'Text...'}
          </p>
        );

      case 'image':
        return (
          <div className="w-full flex flex-col gap-2">
            {block.content ? (
              <div className="relative group">
                <img src={block.content} alt="Block" className="w-full max-h-96 object-contain rounded" />
                {!isPreview && (
                  <button
                    onClick={() => onUpdate(block.id, { content: '' })}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : !isPreview ? (
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        onUpdate(block.id, { content: evt.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="text-sm text-gray-600">Click to upload image</span>
              </label>
            ) : null}
          </div>
        );

      case 'table':
        return (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse" style={{ border: '1px solid #e2e8f0' }}>
              <tbody>
                {Array.from({ length: block.props.rows || 2 }).map((_, r) => (
                  <tr key={r}>
                    {Array.from({ length: block.props.cols || 2 }).map((_, c) => (
                      <td key={c} className="p-3 border border-gray-300 text-sm text-gray-600 bg-gray-50">
                        {block.content ? `Cell ${r + 1},${c + 1}` : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'divider':
        return <hr className="my-6 border-gray-300" />;

      case 'pagebreak':
        return (
          <div className="flex items-center justify-center py-8">
            <div className="text-xs font-bold text-gray-400 uppercase">— Page Break —</div>
          </div>
        );

      case 'footer':
        return (
          <div
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={handleUpdate}
            className="w-full text-xs italic text-gray-500 border-t pt-4 mt-8 transition-all outline-none"
            style={{ textAlign: block.props.alignment }}
          >
            {block.content || 'Footer text...'}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`
        group relative mb-4 w-full px-4 py-2 rounded-lg transition-all duration-300 border-2
        ${selected && !isPreview ? 'border-blue-500 bg-blue-50' : 'border-transparent'}
        ${!isPreview && 'hover:border-gray-200'}
      `}
    >
      {/* Block Controls - Edit Mode Only */}
      {!isPreview && (
        <div
          className={`
            absolute -left-12 top-2 flex flex-col gap-1 transition-opacity duration-200
            ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove?.(block.id, 'up');
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded"
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove?.(block.id, 'down');
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded"
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(block.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
}
