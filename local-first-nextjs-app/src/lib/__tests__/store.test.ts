import { useStore } from "../store";
import { act, renderHook } from "@testing-library/react";

// Mock fetch
global.fetch = jest.fn();

// Mock the db module
jest.mock("../db", () => ({
  db: {
    users: {
      toArray: jest.fn().mockResolvedValue([]),
      clear: jest.fn().mockResolvedValue(undefined),
      bulkAdd: jest.fn().mockResolvedValue(undefined),
      where: jest.fn().mockReturnValue({
        equals: jest.fn().mockReturnValue({
          modify: jest.fn().mockResolvedValue(undefined),
        }),
      }),
    },
    cacheMetadata: {
      clear: jest.fn().mockResolvedValue(undefined),
      add: jest.fn().mockResolvedValue(undefined),
    },
    transaction: jest.fn().mockImplementation(async (mode, tables, callback) => {
      return await callback();
    }),
  },
}));

describe("Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    // Reset navigator.onLine to true for each test
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.users).toEqual([]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.usersPerPage).toBe(10);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("updates loading state correctly", async () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("updates current page correctly", async () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it("updates error state correctly", async () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setError("Test error message");
    });

    expect(result.current.error).toBe("Test error message");

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBe(null);
  });

  it("fetches users successfully", async () => {
    const mockUsers = [
      {
        login: { uuid: "1" },
        name: { first: "John", last: "Doe" },
        email: "john@example.com",
        phone: "123-456-7890",
        picture: { large: "large.jpg", medium: "medium.jpg", thumbnail: "thumb.jpg" },
        location: { city: "NYC", country: "USA" },
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockUsers }),
    });

    const { result } = renderHook(() => useStore());

    await act(async () => {
      await result.current.fetchUsers(1, true);
    });

    expect(fetch).toHaveBeenCalledWith("https://randomuser.me/api/?page=1&results=10");
    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name.first).toBe("John");
    expect(result.current.currentPage).toBe(1);
  });

  it("handles fetch error gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useStore());

    await act(async () => {
      await result.current.fetchUsers(1, true);
    });

    expect(result.current.error).toBe("Failed to fetch users. Loading from cache...");
    expect(result.current.isLoading).toBe(false);
  });

  it("toggles favorite status correctly", async () => {
    const { result } = renderHook(() => useStore());

    // Set initial users
    const mockUsers = [
      {
        uuid: "1",
        name: { first: "John", last: "Doe" },
        email: "john@example.com",
        phone: "123-456-7890",
        picture: { large: "large.jpg", medium: "medium.jpg", thumbnail: "thumb.jpg" },
        location: { city: "NYC", country: "USA" },
        isFavorite: false,
        cachedAt: new Date(),
      },
    ];

    act(() => {
      result.current.setUsers(mockUsers);
    });

    // Toggle favorite
    await act(async () => {
      await result.current.toggleFavorite("1");
    });

    expect(result.current.users[0].isFavorite).toBe(true);

    // Toggle back
    await act(async () => {
      await result.current.toggleFavorite("1");
    });

    expect(result.current.users[0].isFavorite).toBe(false);
  });
});