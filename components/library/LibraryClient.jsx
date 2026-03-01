'use client'

import { useState } from "react"
import BookList from "./BookList"
import Category from "./Category"
import NewlyReleasedBook from "./NewlyReleasedBook"
import SearchBooks from "./SearchBooks"
import YouMayLike from "./YouMayLike"

const LibraryClient = () => {
    // for book_list filters
    const [filters, setFilters] = useState({
        search: null,
        type: null,
        category_ids: null,
        language_id: null,
    });
    // main layout
    return (
        <>
            <div className='w-full flex gap-5 md:gap-10 justify-between items-center'>
                <p className='xl:text-5xl lg:text-3xl text-xl sm:text-2xl font-semibold shrink-0'>Library</p>
                <SearchBooks setFilters={setFilters} filters={filters} />
            </div>
            <Category setFilters={setFilters} filters={filters} />
            <div className="w-full flex flex-col gap-6 justify-start">
                <BookList filters={filters} setFilters={setFilters} />
                <NewlyReleasedBook />
                <YouMayLike />
            </div>
        </>
    );
};
export default LibraryClient;