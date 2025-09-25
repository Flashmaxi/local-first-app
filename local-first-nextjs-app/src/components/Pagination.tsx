import { useStore } from "@/lib/store";

export default function Pagination() {
  const { currentPage, totalPages, usersPerPage, goToPage, isLoading } = useStore();

  if (totalPages <= 1) return null;

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      await goToPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} (showing {usersPerPage} users per page)
        </div>

        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
