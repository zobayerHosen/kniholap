"use client"
import CommonDashboardTitle from '@/components/common/CommonDashboardTitle';
import RecentOrdersCard from './RecentOrdersCard';
import useBooks from '@/hooks/books.hook';
import { useState } from 'react';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState.';

const RecentOrders = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState();
    const { books, isLoading, isFetching, isError } = useBooks({
        currentPage: page,
        perPage,
        orderBy: "desc",
    });

    // Note: main ui component
    return (
        <div className='w-full mt-10 lg:mt-[60px]'>
            <CommonDashboardTitle
                text='Recent Orders'
            />

            {/* recent order cards */}
            <div className='w-full mt-4 xl:mt-8'>
                {/* Loading */}
                {(isLoading || isFetching) ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: perPage || 3 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <ErrorState />
                ) : books?.length === 0 ? (
                    <EmptyState
                        className="py-20"
                        description="No books found with these filters or no books available"
                    />
                ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {books?.map((book) => (
                            <RecentOrdersCard item={book} key={book.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default RecentOrders;