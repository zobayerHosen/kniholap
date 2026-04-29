'use client';

import Loader from '@/components/common/Loader';
import { useState, useRef, useCallback, useEffect } from 'react';
import 'react-pdf-highlighter/dist/style.css';
import {
    PdfLoader,
    PdfHighlighter,
    Highlight,
    Popup,
    AreaHighlight,
} from 'react-pdf-highlighter';

import { FiZoomIn, FiZoomOut, FiX, FiEdit3, FiTrash2, FiBookmark } from 'react-icons/fi';
import { useUser } from '@/hooks/get-user.hook';
import { generateId, loadHighlights, saveHighlights } from '@/utils/generateId';

// ─── Highlight colours ──
const COLORS = [
    { id: 'yellow', bg: '#FDE68A', border: '#F59E0B', label: 'Yellow' },
    { id: 'green', bg: '#A7F3D0', border: '#10B981', label: 'Green' },
    { id: 'blue', bg: '#BFDBFE', border: '#3B82F6', label: 'Blue' },
    { id: 'pink', bg: '#FBCFE8', border: '#EC4899', label: 'Pink' },
];

// ─── Selection Tip (appears right after text is selected) selection tip component ───

function SelectionTip({ onHighlight, onNote, onClose }) {
    return (
        <div
            className="flex items-center gap-1 bg-gray-900 text-white rounded-xl shadow-2xl px-2 py-1.5 animate-fade-in select-none z-50"
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

// ─── Note editor (inline popover) component ─

function NoteEditor({ existingNote = '', onSave, onCancel, onDelete }) {
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

// ─── Highlight popup (shown when clicking an existing highlight) ───

function HighlightPopup({ highlight, onEditNote, onDelete, onChangeColor }) {
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

// ── Sidebar panel ──

function HighlightsSidebar({ highlights, onJump, onDelete }) {
    if (highlights.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-16">
                <FiBookmark className="w-8 h-8 opacity-30" />
                <p className="text-sm text-center leading-relaxed px-4">
                    Select text and choose a colour to start highlighting.
                </p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-100">
            {highlights.map(h => {
                const color = COLORS.find(c => c.id === (h.comment?.color ?? 'yellow')) ?? COLORS[0];
                return (
                    <li key={h.id} className="group px-4 py-3 hover:bg-gray-50 transition-colors">
                        <button
                            className="w-full text-left"
                            onClick={() => onJump(h)}
                        >
                            <div className="flex items-start gap-2">
                                <span
                                    className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: color.bg, outline: `2px solid ${color.border}` }}
                                />
                                <div className="min-w-0">
                                    {h.content?.text && (
                                        <p className="text-xs text-gray-700 line-clamp-2 italic leading-relaxed">
                                            "{h.content.text}"
                                        </p>
                                    )}
                                    {h.comment?.text && (
                                        <p className="text-xs text-amber-700 mt-1 line-clamp-2">
                                            📝 {h.comment.text}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Page {h.position?.pageNumber}
                                    </p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => onDelete(h.id)}
                            className="hidden group-hover:block mt-1 text-[10px] text-red-400 hover:text-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

// ── Main component ──

export default function BookPdfViewInternal({ book }) {
    const { userData } = useUser();
    const userId = userData?.id;

    // book.id used as the storage namespace; fall back to book.pdf_file url
    const bookId = book?.id ?? book?.pdf_file ?? 'unknown';

    const [highlights, setHighlights] = useState(() => loadHighlights(bookId, userId));
    const [scale, setScale] = useState(1.2);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Pending note state: set when user picks "Note" in selection tip
    const [pendingNote, setPendingNote] = useState(null); // { scaledPosition, content, colorId }

    // Edit-existing-note state
    const [editingHighlightId, setEditingHighlightId] = useState(null);

    const highlighterRef = useRef(null);

    // Persist whenever highlights change
    useEffect(() => {
        saveHighlights(bookId, userId, highlights);
    }, [highlights, bookId, userId]);

    // ── Highlight CRUD ──

    const addHighlight = useCallback((scaledPosition, content, colorId = 'yellow', note = '') => {
        const newHighlight = {
            id: generateId(),
            position: scaledPosition,
            content,
            comment: { text: note, color: colorId },
        };
        setHighlights(prev => [newHighlight, ...prev]);
        return newHighlight.id;
    }, []);

    const updateHighlight = useCallback((id, changes) => {
        setHighlights(prev =>
            prev.map(h => (h.id === id ? { ...h, ...changes } : h))
        );
    }, []);

    const deleteHighlight = useCallback((id) => {
        setHighlights(prev => prev.filter(h => h.id !== id));
    }, []);

    // ── Zoom ───

    const zoomIn = () => setScale(s => Math.min(+(s + 0.1).toFixed(1), 3.0));
    const zoomOut = () => setScale(s => Math.max(+(s - 0.1).toFixed(1), 0.5));

    // ── Jump to highlight ──

    const jumpToHighlight = useCallback((h) => {
        if (!highlighterRef.current) return;
        highlighterRef.current.scrollTo(h);
        setSidebarOpen(false);
    }, []);

    // ── Render individual highlight (text layer) ───

    const renderHighlight = useCallback((highlight, index, setTip, hideTip) => {
        const colorId = highlight.comment?.color ?? 'yellow';
        const color = COLORS.find(c => c.id === colorId) ?? COLORS[0];

        if (highlight.content?.image) {
            // Area highlight (image-based)
            return (
                <AreaHighlight
                    key={highlight.id}
                    isScrolledTo={false}
                    highlight={highlight}
                    onChange={boundingRect =>
                        updateHighlight(highlight.id, {
                            position: { ...highlight.position, boundingRect },
                        })
                    }
                />
            );
        }

        return (
            <Highlight
                isScrolledTo={false}
                key={highlight.id}
                highlight={highlight}
                // Custom inline style for the colour
                highlightTransform={(highlightContent, index, setTip, hideTip, transformSelection) => (
                    <span
                        style={{
                            background: color.bg,
                            borderBottom: `2px solid ${color.border}`,
                            cursor: 'pointer',
                            borderRadius: 2,
                        }}
                        onClick={() => {
                            setTip(highlight, h => (
                                <HighlightPopup
                                    highlight={h}
                                    onEditNote={() => {
                                        hideTip();
                                        setEditingHighlightId(h.id);
                                    }}
                                    onDelete={() => {
                                        hideTip();
                                        deleteHighlight(h.id);
                                    }}
                                    onChangeColor={colorId => {
                                        updateHighlight(h.id, {
                                            comment: { ...h.comment, color: colorId },
                                        });
                                        hideTip();
                                    }}
                                />
                            ));
                        }}
                    >
                        {highlightContent}
                    </span>
                )}
                setTip={setTip}
                hideTip={hideTip}
            />
        );
    }, [updateHighlight, deleteHighlight]);

    // ── Highlight being edited ──

    const editingHighlight = editingHighlightId
        ? highlights.find(h => h.id === editingHighlightId)
        : null;

    // ── Render ──

    return (
        <div className="w-full flex flex-col lg:mt-6 items-center relative bg-amber-50/30 min-h-screen">

            {/* ── Top toolbar (book-style header) ── */}
            <div className="flex shadow-md self-end justify-end items-center gap-3 px-4 sm:px-6 py-3 w-full bg-white/80 backdrop-blur-sm border-b border-amber-200/50">

                {/* Zoom controls */}
                <div className="flex gap-2 items-center bg-amber-50/50 rounded-full px-2 py-1">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        className="p-1.5 cursor-pointer rounded-full text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <FiZoomOut className="w-4 h-4" />
                    </button>
                    <p className="text-amber-800 font-serif text-sm text-center min-w-[3rem] font-medium">
                        {(scale * 100).toFixed(0)}%
                    </p>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 3.0}
                        className="p-1.5 rounded-full cursor-pointer text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <FiZoomIn className="w-4 h-4" />
                    </button>
                </div>

                <div className="sm:mx-2 mx-1 h-6 border-l border-amber-200" />

                {/* Highlights sidebar toggle - book style button */}
                <button
                    onClick={() => setSidebarOpen(o => !o)}
                    className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
                    ${sidebarOpen
                            ? 'bg-amber-500 text-white shadow-amber-200'
                            : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                        }
                `}
                >
                    <FiBookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Bookmarks</span>
                    {highlights.length > 0 && (
                        <span className={`
                        text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-colors
                        ${sidebarOpen ? 'bg-amber-400/30 text-white' : 'bg-amber-100 text-amber-700'}
                    `}>
                            {highlights.length}
                        </span>
                    )}
                </button>
            </div>

            {/* ── Layout: sidebar + pdf (book spread style) ── */}
            <div className="flex w-full relative max-w-7xl mx-auto px-4 lg:px-6 mt-5">

                {/* Sidebar - Like a book's margin notes */}
                {sidebarOpen && (
                    <aside className="hidden md:block w-80 shrink-0 bg-white/95 rounded-2xl shadow-lg border border-amber-100 overflow-y-auto max-h-[calc(100vh-140px)] sticky top-24 backdrop-blur-sm">
                        <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
                            <h3 className="text-base font-serif font-semibold text-amber-800 flex items-center gap-2">
                                <FiBookmark className="w-4 h-4 text-amber-500" />
                                Your Annotations
                            </h3>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 rounded-full hover:bg-amber-100 transition-colors text-amber-500"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-amber-50">
                            <HighlightsSidebar
                                highlights={highlights}
                                onJump={jumpToHighlight}
                                onDelete={deleteHighlight}
                            />
                        </div>
                    </aside>
                )}

                {/* PDF viewer - Like an open book page */}
                <div className="flex-1 relative" style={{ height: 'calc(100vh - 130px)' }}>
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-100">
                        {/* Book-like page curl effect */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100/30 to-transparent pointer-events-none z-10 rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-100/20 to-transparent pointer-events-none z-10 rounded-bl-2xl" />

                        <PdfLoader
                            url={book?.pdf_file}
                            beforeLoad={<div className="flex justify-center items-center h-full"><Loader /></div>}
                        >
                            {pdfDocument => (
                                <PdfHighlighter
                                    ref={highlighterRef}
                                    pdfDocument={pdfDocument}
                                    enableAreaSelection={e => e.altKey}
                                    pdfScaleValue={String(scale)}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        overflow: 'auto',
                                        background: '#faf7f2',
                                    }}
                                    highlights={highlights}
                                    onScrollChange={() => { }}
                                    scrollRef={scrollTo => {
                                        highlighterRef.current = { scrollTo };
                                    }}
                                    onSelectionFinished={(
                                        scaledPosition,
                                        content,
                                        hideTipAndSelection,
                                        transformSelection
                                    ) => (
                                        <SelectionTip
                                            onHighlight={colorId => {
                                                addHighlight(scaledPosition, content, colorId);
                                                hideTipAndSelection();
                                            }}
                                            onNote={() => {
                                                setPendingNote({ scaledPosition, content, colorId: 'yellow' });
                                                hideTipAndSelection();
                                            }}
                                            onClose={hideTipAndSelection}
                                        />
                                    )}
                                    highlightTransform={(
                                        highlight,
                                        index,
                                        setTip,
                                        hideTip,
                                        viewportToScaled,
                                        screenshot,
                                        isScrolledTo
                                    ) => {
                                        const colorId = highlight.comment?.color ?? 'yellow';
                                        const color = COLORS.find(c => c.id === colorId) ?? COLORS[0];

                                        const popupContent = (
                                            <HighlightPopup
                                                highlight={highlight}
                                                onEditNote={() => {
                                                    hideTip();
                                                    setEditingHighlightId(highlight.id);
                                                }}
                                                onDelete={() => {
                                                    hideTip();
                                                    deleteHighlight(highlight.id);
                                                }}
                                                onChangeColor={newColorId => {
                                                    updateHighlight(highlight.id, {
                                                        comment: { ...highlight.comment, color: newColorId },
                                                    });
                                                    hideTip();
                                                }}
                                            />
                                        );

                                        if (highlight.content?.image) {
                                            return (
                                                <Popup
                                                    popupContent={popupContent}
                                                    onMouseOver={popupContent => setTip(highlight, () => popupContent)}
                                                    onMouseOut={hideTip}
                                                    key={highlight.id}
                                                >
                                                    <AreaHighlight
                                                        isScrolledTo={isScrolledTo}
                                                        highlight={highlight}
                                                        onChange={boundingRect =>
                                                            updateHighlight(highlight.id, {
                                                                position: { ...highlight.position, boundingRect },
                                                            })
                                                        }
                                                    />
                                                </Popup>
                                            );
                                        }

                                        return (
                                            <Popup
                                                popupContent={popupContent}
                                                onMouseOver={popupContent => setTip(highlight, () => popupContent)}
                                                onMouseOut={hideTip}
                                                key={highlight.id}
                                            >
                                                <Highlight
                                                    isScrolledTo={isScrolledTo}
                                                    position={highlight.position}
                                                    comment={highlight.comment}
                                                    customColor={color.bg}
                                                />
                                            </Popup>
                                        );
                                    }}
                                />
                            )}
                        </PdfLoader>
                    </div>
                </div>
            </div>

            {/* ── Floating note editor (pending new note) - book-style modal ── */}
            {pendingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/30 backdrop-blur-md">
                    <div className="relative">
                        <div className="absolute bg-gradient-to-r from-amber-200 to-amber-400 rounded-2xl blur opacity-30" />
                        <NoteEditor
                            existingNote=""
                            onSave={text => {
                                addHighlight(
                                    pendingNote.scaledPosition,
                                    pendingNote.content,
                                    pendingNote.colorId,
                                    text
                                );
                                setPendingNote(null);
                            }}
                            onCancel={() => setPendingNote(null)}
                        />
                    </div>
                </div>
            )}

            {/* ── Floating note editor (editing existing highlight) ── */}
            {editingHighlight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/30 backdrop-blur-md">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-400 rounded-2xl blur opacity-30" />
                        <NoteEditor
                            existingNote={editingHighlight.comment?.text ?? ''}
                            onSave={text => {
                                updateHighlight(editingHighlight.id, {
                                    comment: { ...editingHighlight.comment, text },
                                });
                                setEditingHighlightId(null);
                            }}
                            onCancel={() => setEditingHighlightId(null)}
                            onDelete={() => {
                                updateHighlight(editingHighlight.id, {
                                    comment: { ...editingHighlight.comment, text: '' },
                                });
                                setEditingHighlightId(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* ── Mobile sidebar (book-style bottom sheet) ── */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-amber-100 max-h-[65vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 sticky top-0 bg-white/95 backdrop-blur-sm">
                        <h3 className="text-base font-serif font-semibold text-amber-800 flex items-center gap-2">
                            <FiBookmark className="w-4 h-4 text-amber-500" />
                            Annotations
                        </h3>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-full hover:bg-amber-100 transition-colors text-amber-500"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="divide-y divide-amber-50">
                        <HighlightsSidebar
                            highlights={highlights}
                            onJump={jumpToHighlight}
                            onDelete={deleteHighlight}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}