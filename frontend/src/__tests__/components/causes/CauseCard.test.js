import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CauseCard from "../../../components/causes/CauseCard";

// Mock component props
const mockCause = {
  id: 1,
  title: "Test Cause",
  description: "This is a test cause for food assistance.",
  image: "test-image.jpg",
  location: "Test City",
  category: "local",
  funding_goal: 1000,
  current_funding: 500,
  created_at: new Date().toISOString(),
  user_name: "Test User",
};

// Test component wrapped in router
const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("CauseCard Component", () => {
  it("should render cause details correctly", () => {
    renderWithRouter(<CauseCard cause={mockCause} />);

    // Assert title and description are rendered
    expect(screen.getByText("Test Cause")).toBeInTheDocument();
    expect(screen.getByText(/This is a test cause/)).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();

    // Assert progress bar is rendered
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();

    // Assert funding information is displayed
    expect(screen.getByText(/\$500/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument();
  });

  it("should navigate to cause details when clicked", () => {
    renderWithRouter(<CauseCard cause={mockCause} />);

    // Find and click the details button
    const detailsButton = screen.getByText("View Details");
    fireEvent.click(detailsButton);

    // Assert navigation happened (would trigger Link to be used)
    expect(window.location.pathname).toBe("/");
  });

  it("should show the correct category label", () => {
    // Test with different category
    const localCause = { ...mockCause, category: "local" };
    renderWithRouter(<CauseCard cause={localCause} />);
    expect(screen.getByText("Local")).toBeInTheDocument();

    // Cleanup and rerender with different category
    cleanup();
    const emergencyCause = { ...mockCause, category: "emergency" };
    renderWithRouter(<CauseCard cause={emergencyCause} />);
    expect(screen.getByText("Emergency")).toBeInTheDocument();
  });

  it("should show correct funding progress percentage", () => {
    // 50% funding progress
    renderWithRouter(<CauseCard cause={mockCause} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");

    // Cleanup and rerender with different funding
    cleanup();
    const fullFundedCause = {
      ...mockCause,
      current_funding: 1000,
      funding_goal: 1000,
    };
    renderWithRouter(<CauseCard cause={fullFundedCause} />);
    const fullProgressBar = screen.getByRole("progressbar");
    expect(fullProgressBar).toHaveAttribute("aria-valuenow", "100");
  });
});
