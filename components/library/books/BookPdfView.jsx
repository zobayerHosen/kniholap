'use client';
/*
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

// ... (Reading logic commented out per client request)
*/

export default function BookPdfViewInternal({ book }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 lg:py-20 text-center gap-4 bg-amber-50/30 rounded-3xl border border-amber-100">
            <h2 className="text-2xl md:text-3xl font-bold font-secondary text-amber-900">Reading is Available Only in our Mobile App</h2>
            <p className="text-gray-600 max-w-md">
                To provide the best reading experience, eBooks are now exclusively available on the Kniholap mobile application. 
                Please download the app to continue reading.
            </p>
            <div className="mt-4">
               <a href="/download-app" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
                  Get the App
               </a>
            </div>
        </div>
    );
}