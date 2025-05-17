import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import PrivateRoute from "../../../components/auth/PrivateRoute";

// Mock the react-redux and react-router-dom hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => <div>Navigate to login</div>),
  Outlet: jest.fn(() => <div>Protected content</div>),
}));

describe("PrivateRoute Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render spinner when loading", () => {
    // Mock auth state with loading
    useSelector.mockReturnValue({
      user: null,
      isLoading: true,
    });

    // Render component
    render(<PrivateRoute />);

    // Assert loading spinner is shown
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled();
    expect(Outlet).not.toHaveBeenCalled();
  });

  it("should render Outlet when user is authenticated", () => {
    // Mock auth state with authenticated user
    useSelector.mockReturnValue({
      user: { id: 1, name: "Test User" },
      isLoading: false,
    });

    // Render component
    render(<PrivateRoute />);

    // Assert Outlet is rendered
    expect(Outlet).toHaveBeenCalled();
    expect(Navigate).not.toHaveBeenCalled();
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("should navigate to login when user is not authenticated", () => {
    // Mock auth state with no user
    useSelector.mockReturnValue({
      user: null,
      isLoading: false,
    });

    // Render component
    render(<PrivateRoute />);

    // Assert Navigate is called with correct props
    expect(Navigate).toHaveBeenCalledWith({ to: "/login" }, {});
    expect(Outlet).not.toHaveBeenCalled();
    expect(screen.getByText("Navigate to login")).toBeInTheDocument();
  });
});
