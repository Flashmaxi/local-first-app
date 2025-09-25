import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";
import { useStore } from "@/lib/store";

// Mock the store
jest.mock("@/lib/store", () => ({
  useStore: jest.fn(),
}));

const mockGoToPage = jest.fn();

beforeEach(() => {
  mockGoToPage.mockClear();
});

describe("Pagination", () => {
  it("does not render when totalPages is 1 or less", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 1,
      totalPages: 1,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    const { container } = render(<Pagination />);
    expect(container.firstChild).toBeNull();
  });

  it("renders pagination controls when totalPages > 1", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 2,
      totalPages: 5,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    expect(screen.getByText("Page 2 of 5 (showing 10 users per page)")).toBeInTheDocument();
    expect(screen.getByText("← Previous")).toBeInTheDocument();
    expect(screen.getByText("Next →")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 1,
      totalPages: 3,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const prevButton = screen.getByText("← Previous");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 3,
      totalPages: 3,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const nextButton = screen.getByText("Next →");
    expect(nextButton).toBeDisabled();
  });

  it("calls goToPage when page number is clicked", async () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 1,
      totalPages: 3,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);

    expect(mockGoToPage).toHaveBeenCalledWith(2);
    expect(mockGoToPage).toHaveBeenCalledTimes(1);
  });

  it("calls goToPage when previous button is clicked", async () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 2,
      totalPages: 3,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const prevButton = screen.getByText("← Previous");
    fireEvent.click(prevButton);

    expect(mockGoToPage).toHaveBeenCalledWith(1);
  });

  it("calls goToPage when next button is clicked", async () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 1,
      totalPages: 3,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const nextButton = screen.getByText("Next →");
    fireEvent.click(nextButton);

    expect(mockGoToPage).toHaveBeenCalledWith(2);
  });

  it("disables all buttons when loading", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 2,
      totalPages: 5,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: true,
    });

    render(<Pagination />);

    const prevButton = screen.getByText("← Previous");
    const nextButton = screen.getByText("Next →");
    const page1Button = screen.getByText("1");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(page1Button).toBeDisabled();
  });

  it("highlights current page button", () => {
    (useStore as jest.Mock).mockReturnValue({
      currentPage: 3,
      totalPages: 5,
      usersPerPage: 10,
      goToPage: mockGoToPage,
      isLoading: false,
    });

    render(<Pagination />);

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass("bg-blue-500", "text-white");

    const otherPageButton = screen.getByText("2");
    expect(otherPageButton).not.toHaveClass("bg-blue-500", "text-white");
  });
});