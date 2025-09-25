import { User } from "@/lib/db";
import { useStore } from "@/lib/store";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const { toggleFavorite } = useStore();

  return (
    <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1">
      {/* Card Header with Gradient */}
      <div className="relative bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 pb-4">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full -mr-10 -mt-10"></div>

        <div className="relative flex items-start space-x-4">
          <div className="relative">
            <img
              src={user.picture.large}
              alt={`${user.name.first} ${user.name.last}`}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-slate-200/60 ring-4 ring-white/50"
            />
            <div className="absolute -bottom-2 -right-2">
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {user.name.first} {user.name.last}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">Active now</span>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(user.uuid)}
                className={`flex-shrink-0 group/heart p-2.5 rounded-xl transition-all duration-200 ${
                  user.isFavorite
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-110 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 hover:scale-110"
                }`}
              >
                <div className="relative">
                  {user.isFavorite ? (
                    <svg className="w-5 h-5 transition-transform group-hover/heart:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 transition-transform group-hover/heart:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 group/item">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/30 transition-colors">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{user.email}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Email address</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 group/item">
            <div className="flex-shrink-0 w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover/item:bg-green-100 dark:group-hover/item:bg-green-900/30 transition-colors">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{user.phone}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Phone number</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 group/item">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover/item:bg-purple-100 dark:group-hover/item:bg-purple-900/30 transition-colors">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                {user.location.city}, {user.location.country}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
