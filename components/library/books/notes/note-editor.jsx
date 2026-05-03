export function NoteEditor({ existingNote = '', onSave, onCancel, onDelete }) {
    const [text, setText] = useState(existingNote);

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 z-50 animate-fade-in">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {existingNote ? 'Edit note' : 'Add note'}
            </p>
            <textarea
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write your note here…"
                rows={4}
                className="
                    w-full resize-none rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                    placeholder-gray-300
                "
            />
            <div className="flex gap-2 mt-3">
                <button
                    onClick={() => onSave(text)}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                {existingNote && (
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete note"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}