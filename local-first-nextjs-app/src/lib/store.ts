import { create } from "zustand";
import { db, User } from "./db";

export interface AppState {
  users: User[];

  currentPage: number;
  usersPerPage: number;

  isLoading: boolean;
  isOnline: boolean;
  error: string | null;

  // Actions
  setUsers: (users: User[]) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
  setError: (error: string | null) => void;
  toggleFavorite: (userId: string) => Promise<void>;
  fetchUsers: (page: number, forceRefresh?: boolean) => Promise<void>;
  loadFromCache: () => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  // Initial state
  users: [],
  currentPage: 1,
  usersPerPage: 10,
  isLoading: false,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  error: null,

  // Actions
  setUsers: (users) => set({ users }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOnline: (online) => set({ isOnline: online }),
  setError: (error) => set({ error }),

  toggleFavorite: async (userId: string) => {
    const { users } = get();
    const updatedUsers = users.map((user) =>
      user.uuid === userId ? { ...user, isFavorite: !user.isFavorite } : user
    );

    set({ users: updatedUsers });

    // Update IndexedDB only if available (client-side)
    if (typeof window !== "undefined" && db) {
      try {
        const user = updatedUsers.find((u) => u.uuid === userId);
        if (user) {
          await db.users.where("uuid").equals(userId).modify({
            isFavorite: user.isFavorite,
          });
        }
      } catch (error) {
        console.error("Failed to update favorite status in DB:", error);
      }
    }
  },

  fetchUsers: async (page: number, forceRefresh = false) => {
    const { isOnline, setLoading, setError, setUsers } = get();

    if (!forceRefresh && typeof window !== "undefined" && db) {
      // Try to load from cache first
      try {
        const cachedUsers = await db.users.toArray();
        if (cachedUsers.length > 0) {
          setUsers(cachedUsers);
          return;
        }
      } catch (error) {
        console.error("Error loading from cache:", error);
      }
    }

    if (!isOnline) {
      await get().loadFromCache();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://randomuser.me/api/?page=${page}&results=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      const users: User[] = data.results.map((user: any) => ({
        uuid: user.login.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: {
          city: user.location.city,
          country: user.location.country,
        },
        isFavorite: false,
        cachedAt: new Date(),
      }));

      // Store in IndexedDB only if available (client-side)
      if (typeof window !== "undefined" && db) {
        try {
          await db.transaction("rw", db.users, db.cacheMetadata, async () => {
            if (page === 1) {
              await db.users.clear();
              await db.cacheMetadata.clear();
            }

            await db.users.bulkAdd(users);
            await db.cacheMetadata.add({
              key: `page_${page}`,
              lastFetched: new Date(),
              page,
            });
          });
        } catch (error) {
          console.error("Error saving to cache:", error);
        }
      }

      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Loading from cache...");
      await get().loadFromCache();
    } finally {
      setLoading(false);
    }
  },

  loadFromCache: async () => {
    const { setUsers, setError } = get();

    if (typeof window === "undefined" || !db) {
      setError("Cache not available.");
      return;
    }

    try {
      const cachedUsers = await db.users.toArray();
      if (cachedUsers.length > 0) {
        setUsers(cachedUsers);
        setError("You are offline. Showing cached data.");
      } else {
        setError("No cached data available.");
      }
    } catch (error) {
      console.error("Error loading from cache:", error);
      setError("Failed to load cached data.");
    }
  },
}));

// Listen for online/offline events only on client side
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    useStore.getState().setOnline(true);
    useStore.getState().setError(null);
  });

  window.addEventListener("offline", () => {
    useStore.getState().setOnline(false);
    useStore.getState().setError("You are offline. Showing cached data.");
  });
}
