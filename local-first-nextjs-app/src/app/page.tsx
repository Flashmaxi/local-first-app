"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import UserCard from "@/components/UserCard";
import Pagination from "@/components/Pagination";

export default function Home() {
  const { users, isLoading, error, fetchUsers } = useStore();

  // Fetch users on page load
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Directory
          </h1>
          <p className="text-gray-600">{users.length} users loaded</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">⚠️ {error}</p>
            <button
              onClick={() => fetchUsers(1, true)}
              className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* User Grid */}
        {users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard key={user.uuid} user={user} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No users found</p>
            <button
              onClick={() => fetchUsers(1, true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Load Users
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
