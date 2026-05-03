export function HighlightPopup({ highlight, onEditNote, onDelete, onChangeColor }) {
    return (
        <div className="bg-gray-900 text-white rounded-xl shadow-2xl px-3 py-2 w-64 z-50 animate-fade-in">
            {/* Quoted text preview */}
            {highlight.content?.text && (
                <p className="text-xs text-gray-400 italic line-clamp-2 mb-2 border-l-2 border-amber-400 pl-2">
                    "{highlight.content.text}"
                </p>
            )}

            {/* Existing note */}
            {highlight.comment?.text && (
                <p className="text-xs text-gray-200 mb-3 leading-relaxed">
                    {highlight.comment.text}
                </p>
            )}

            <div className="flex items-center gap-2">
                {/* Colour change */}
                {COLORS.map(c => (
                    <button
                        key={c.id}
                        onClick={() => onChangeColor(c.id)}
                        className="w-4 h-4 rounded-full border-2 hover:scale-110 transition-transform"
                        style={{
                            backgroundColor: c.bg,
                            borderColor:
                                highlight.comment?.color === c.id ? c.border : 'transparent',
                        }}
                    />
                ))}

                <div className="flex-1" />

                {/* Edit / add note */}
                <button
                    onClick={onEditNote}
                    className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
                    title={highlight.comment?.text ? 'Edit note' : 'Add note'}
                >
                    <FiEdit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete highlight */}
                <button
                    onClick={onDelete}
                    className="p-1 rounded-lg hover:bg-red-700 transition-colors"
                    title="Remove highlight"
                >
                    <FiTrash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}