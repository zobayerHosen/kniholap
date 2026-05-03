export function SelectionTip({ onHighlight, onNote, onClose }) {
    return (
        <div
            className="
                flex items-center gap-1 bg-gray-900 text-white rounded-xl shadow-2xl px-2 py-1.5
                animate-fade-in select-none z-50
            "
            style={{ fontSize: 13 }}
        >
            {/* Colour swatches */}
            {COLORS.map(c => (
                <button
                    key={c.id}
                    title={`Highlight ${c.label}`}
                    onClick={() => onHighlight(c.id)}
                    className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                />
            ))}

            <div className="w-px h-4 bg-gray-600 mx-1" />

            {/* Add note */}
            <button
                onClick={onNote}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium"
            >
                <FiEdit3 className="w-3.5 h-3.5" />
                Note
            </button>

            {/* Close / cancel */}
            <button
                onClick={onClose}
                className="ml-1 p-0.5 rounded-full hover:bg-gray-700 transition-colors"
            >
                <FiX className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}