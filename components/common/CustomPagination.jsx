import { cn } from "@/lib/utils"
import { Pagination } from 'antd';
const CustomPagination = ({
    handlePageClick,
    showSizeChanger = false,
    perPage = 10,
    totalItem = 10,
    currentPage = 1,
    className
}) => {
    return (
        <div className={cn("flex justify-center items-center w-full", className)}>
            <Pagination
                showSizeChanger={showSizeChanger}
                onChange={handlePageClick}
                current={currentPage}
                pageSize={perPage}
                total={totalItem}
                pageSizeOptions={[4, 8, 16, 32]}
            />
        </div>
    )
};
export default CustomPagination;