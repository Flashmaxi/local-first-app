import Dexie, { Table } from "dexie";

export interface User {
  id?: number;
  uuid: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  location: {
    city: string;
    country: string;
  };
  isFavorite?: boolean;
  cachedAt: Date;
}

export interface CacheMetadata {
  id?: number;
  key: string;
  lastFetched: Date;
  page: number;
}

export class UserDatabase extends Dexie {
  users!: Table<User>;
  cacheMetadata!: Table<CacheMetadata>;

  constructor() {
    super("UserDatabase");
    this.version(1).stores({
      users: "++id, uuid, email, isFavorite, cachedAt",
      cacheMetadata: "++id, key, lastFetched, page",
    });
  }
}

let db: UserDatabase;

if (typeof window !== "undefined") {
  db = new UserDatabase();

  // Handle potential database errors
  db.open().catch((error) => {
    console.error("Failed to open database:", error);
  });
}

export { db };
