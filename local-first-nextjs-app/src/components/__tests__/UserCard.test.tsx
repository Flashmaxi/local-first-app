import { render, screen, fireEvent } from "@testing-library/react";
import UserCard from "../UserCard";
import { useStore } from "@/lib/store";

// Mock the store
jest.mock("@/lib/store", () => ({
  useStore: jest.fn(),
}));

const mockUser = {
  uuid: "test-uuid-123",
  name: {
    first: "John",
    last: "Doe",
  },
  email: "john.doe@example.com",
  phone: "+1-555-123-4567",
  picture: {
    large: "https://example.com/large.jpg",
    medium: "https://example.com/medium.jpg",
    thumbnail: "https://example.com/thumb.jpg",
  },
  location: {
    city: "New York",
    country: "USA",
  },
  isFavorite: false,
  cachedAt: new Date(),
};

const mockToggleFavorite = jest.fn();

beforeEach(() => {
  (useStore as jest.Mock).mockReturnValue({
    toggleFavorite: mockToggleFavorite,
  });
  mockToggleFavorite.mockClear();
});

describe("UserCard", () => {
  it("renders user information correctly", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("📧 john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("📞 +1-555-123-4567")).toBeInTheDocument();
    expect(screen.getByText("📍 New York, USA")).toBeInTheDocument();
  });

  it("displays empty heart when user is not favorite", () => {
    render(<UserCard user={mockUser} />);

    const heartButton = screen.getByRole("button");
    expect(heartButton).toHaveTextContent("🤍");
  });

  it("displays filled heart when user is favorite", () => {
    const favoriteUser = { ...mockUser, isFavorite: true };
    render(<UserCard user={favoriteUser} />);

    const heartButton = screen.getByRole("button");
    expect(heartButton).toHaveTextContent("❤️");
  });

  it("calls toggleFavorite when heart button is clicked", () => {
    render(<UserCard user={mockUser} />);

    const heartButton = screen.getByRole("button");
    fireEvent.click(heartButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith("test-uuid-123");
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("applies correct CSS classes for favorite status", () => {
    render(<UserCard user={mockUser} />);

    const heartButton = screen.getByRole("button");
    expect(heartButton).toHaveClass("text-gray-400");
  });

  it("applies correct CSS classes for favorite user", () => {
    const favoriteUser = { ...mockUser, isFavorite: true };
    render(<UserCard user={favoriteUser} />);

    const heartButton = screen.getByRole("button");
    expect(heartButton).toHaveClass("text-red-500");
  });
});