import { User } from "@/lib/db";
import { useStore } from "@/lib/store";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const { toggleFavorite } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name.first} {user.name.last}
              </h3>
              <button
                onClick={() => toggleFavorite(user.uuid)}
                className={`p-2 rounded-full transition-colors ${
                  user.isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-500"
                }`}
              >
                ❤️
              </button>
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">📧 {user.email}</p>
              <p className="text-sm text-gray-600">📞 {user.phone}</p>
              <p className="text-sm text-gray-600">
                📍 {user.location.city}, {user.location.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
