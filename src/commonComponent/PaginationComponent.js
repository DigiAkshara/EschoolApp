import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'

const PaginationComponent = ({
  currentPage,
  totalCount,
  onPageChange,
}) => {
  function calculatePagination(totalCount, currentPage, itemsPerPage=10) {
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

const pagination = calculatePagination(totalCount, currentPage);

  return (
    <>
      <div className="pagination">
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-3">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {pagination.startIndex + 1}
                </span>{' '}
                to <span className="font-medium">{pagination.endIndex + 1}</span>{' '}
                of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon aria-hidden="true" className="size-5" />
                </a>
                {/* Current: "z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                {Array.from({length: pagination.totalPages}, (_, index) => index + 1).map(
                  (page) => (
                    <a
                      key={page}
                      href="#"
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                      className={`relative z-10 inline-flex items-center ${
                        page === pagination.currentPage
                          ? 'bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                      } px-4 py-2 text-sm font-semibold`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </a>
                  ),
                )}
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon aria-hidden="true" className="size-5" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaginationComponent
