import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const PaginationComponent = ({
  currentPage,
  totalCount,
  onPageChange,
  itemsPerPage = 10,
}) => {
  function calculatePagination(totalCount, currentPage, itemsPerPage = 10) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalCount - 1);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }

  const pagination = calculatePagination(totalCount, currentPage, itemsPerPage);

  const getVisiblePages = () => {
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    const pages = [];

    // If total pages are less than or equal to 5, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Show dots if current page is beyond 3
    if (current > 3) pages.push('...');

    // Determine the middle pages
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Show dots if current page is not close to the end
    if (current < totalPages - 2) pages.push('...');

    // Always show last page
    pages.push(totalPages);

    return pages;
  };


  return (
    <div className="pagination">
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            type="button"
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{pagination.startIndex + 1}</span> to{' '}
              <span className="font-medium">{pagination.endIndex + 1}</span> of{' '}
              <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div>
            <nav
              aria-label="Pagination"
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            >
              {/* Previous */}
              <button
                type="button"
                onClick={() => pagination.hasPrevPage && onPageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
              </button>

              {/* Page Numbers */}
              {getVisiblePages().map((page, index) =>
                page === '...' ? (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    onClick={() => onPageChange(page)}
                    aria-current={page === pagination.currentPage ? 'page' : undefined}
                    className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pagination.currentPage
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                )
              )}


              {/* Next */}
              <button
                type="button"
                onClick={() => pagination.hasNextPage && onPageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
