import { useStore } from "@/lib/store";

export default function Pagination() {
  const { currentPage, totalPages, usersPerPage, goToPage, isLoading } =
    useStore();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      goToPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Page Info */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600"></div>
          <span className="text-slate-500 dark:text-slate-400">
            {usersPerPage} profiles per page
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="group inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium max-md:hidden">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                className={`w-11 h-11 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-105"
                }`}
              >
                {isLoading && page === currentPage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  page
                )}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="group inline-flex items-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <span className="font-medium max-md:hidden">Next</span>
            <svg
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
