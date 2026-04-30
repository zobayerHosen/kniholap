'use client';
/*
import dynamic from 'next/dynamic';
import Loader from '@/components/common/Loader';
import { useUser } from '@/hooks/get-user.hook';
import Link from 'next/link';

// Dynamically import BookPdfViewInternal and disable SSR
const BookPdfView = dynamic(
    () => import('./BookPdfView'),
    {
        ssr: false,
        loading: () => <Loader text="Loading PDF Viewer..." />
    }
);
*/
import BookPdfView from './BookPdfView';

const BookPdfClient = ({ book = {} }) => {
    // The reading functionality has been moved to the mobile application.
    return (
        <div className="relative">
            <BookPdfView book={book} />
        </div>
    );
};

export default BookPdfClient;

/*
// Subscription Gate Component
const SubscriptionGate = () => {
    // ... (commented out)
};
*/