import { create } from "zustand";
import { db, User } from "./db";

export interface AppState {
  allUsers: User[];
  users: User[];

  currentPage: number;
  usersPerPage: number;
  totalPages: number;

  isLoading: boolean;
  isOnline: boolean;
  isManualOffline: boolean;
  error: string | null;

  setAllUsers: (users: User[]) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
  setError: (error: string | null) => void;
  toggleFavorite: (userId: string) => Promise<void>;
  fetchUsers: (forceRefresh?: boolean) => Promise<void>;
  loadFromCache: () => Promise<void>;
  goToPage: (page: number) => void;
  updateDisplayUsers: () => void;
  toggleManualOffline: () => void;
}

export const useStore = create<AppState>()((set, get) => ({
  allUsers: [],
  users: [],
  currentPage: 1,
  usersPerPage: 10,
  totalPages: 1,
  isLoading: false,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  isManualOffline: false,
  error: null,

  setAllUsers: (allUsers) => {
    const totalPages = Math.ceil(allUsers.length / 10);
    set({ allUsers, totalPages });
    get().updateDisplayUsers();
  },
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().updateDisplayUsers();
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setOnline: (online) => {
    if (!get().isManualOffline) {
      set({ isOnline: online });
    }
  },
  setError: (error) => set({ error }),

  updateDisplayUsers: () => {
    const { allUsers, currentPage, usersPerPage } = get();
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const users = allUsers.slice(startIndex, endIndex);
    set({ users });
  },

  goToPage: (page: number) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) {
      get().setCurrentPage(page);
    }
  },

  toggleFavorite: async (userId: string) => {
    const { allUsers } = get();
    const updatedAllUsers = allUsers.map((user) =>
      user.uuid === userId ? { ...user, isFavorite: !user.isFavorite } : user
    );

    set({ allUsers: updatedAllUsers });
    get().updateDisplayUsers();

    if (typeof window !== "undefined" && db) {
      try {
        const user = updatedAllUsers.find((u) => u.uuid === userId);
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

  fetchUsers: async (forceRefresh = false) => {
    const { isOnline, setLoading, setError, setAllUsers, loadFromCache } =
      get();

    if (!isOnline) {
      await loadFromCache();
      return;
    }

    if (!forceRefresh && get().allUsers.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://randomuser.me/api/?page=1&results=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      let existingFavorites: { [uuid: string]: boolean } = {};
      if (typeof window !== "undefined" && db) {
        try {
          const cachedUsers = await db.users.toArray();
          existingFavorites = cachedUsers.reduce((acc, user) => {
            if (user.isFavorite) {
              acc[user.uuid] = true;
            }
            return acc;
          }, {} as { [uuid: string]: boolean });
        } catch (error) {
          console.error("Error loading existing favorites:", error);
        }
      }

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
        isFavorite: existingFavorites[user.login.uuid] || false,
        cachedAt: new Date(),
      }));

      if (typeof window !== "undefined" && db) {
        try {
          await db.transaction("rw", db.users, db.cacheMetadata, async () => {
            await db.users.clear();
            await db.cacheMetadata.clear();

            await db.users.bulkAdd(users);
            await db.cacheMetadata.add({
              key: "all_users",
              lastFetched: new Date(),
              page: 1,
            });
          });
        } catch (error) {
          console.error("Error saving to cache:", error);
        }
      }

      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Loading from cache...");
      await get().loadFromCache();
    } finally {
      setLoading(false);
    }
  },

  loadFromCache: async () => {
    const { setAllUsers, setError } = get();

    if (typeof window === "undefined" || !db) {
      setError("Cache not available.");
      return;
    }

    try {
      const cachedUsers = await db.users.toArray();
      if (cachedUsers.length > 0) {
        setAllUsers(cachedUsers);
        setError("You are offline. Showing cached data.");
      } else {
        setError("No cached data available.");
      }
    } catch (error) {
      console.error("Error loading from cache:", error);
      setError("Failed to load cached data.");
    }
  },

  toggleManualOffline: () => {
    const { isManualOffline, loadFromCache, setOnline, setError } = get();
    const newManualOffline = !isManualOffline;

    if (newManualOffline) {
      set({ isManualOffline: true });
      setOnline(false);
      setError("Simulated offline mode enabled. Showing cached data.");
      loadFromCache();
    } else {
      const actualOnlineStatus =
        typeof window !== "undefined" ? navigator.onLine : true;

      set({ isManualOffline: false });
      setOnline(actualOnlineStatus);

      if (actualOnlineStatus) {
        setError(null);
        get().fetchUsers();
      } else {
        setError("You are offline. Showing cached data.");
      }
    }
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    if (!useStore.getState().isManualOffline) {
      useStore.getState().setOnline(true);
      useStore.getState().setError(null);
    }
  });

  window.addEventListener("offline", () => {
    if (!useStore.getState().isManualOffline) {
      useStore.getState().setOnline(false);
      useStore.getState().setError("You are offline. Showing cached data.");
    }
  });
}
