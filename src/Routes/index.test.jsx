import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from "vitest";
import Routes from "./index";
import { AuthProvider } from "../Context/auth";

vi.mock("./publicRoutes", () => ({
  default: () => <div>Public Routes</div>,
}));

vi.mock("./protectedRoutes", () => ({
  default: () => <div>Protected Routes</div>,
}));

describe("Routes Component", () => {
  const renderWithAuth = (user) => {
    if (user) {
      localStorage.setItem("@App:user", JSON.stringify(user));
      localStorage.setItem("@App:token", JSON.stringify("mockToken"));
    } else {
      localStorage.removeItem("@App:user");
      localStorage.removeItem("@App:token");
    }

    return render(
      <AuthProvider>
        <Routes />
      </AuthProvider>
    );
  };

  it("should render only PublicRoutes when user is not signed in", () => {
    renderWithAuth(null);

    expect(screen.getByText("Public Routes")).toBeInTheDocument();
    expect(screen.queryByText("Protected Routes")).not.toBeInTheDocument();
  });

  it("should render both ProtectedRoutes and PublicRoutes when user is signed in", () => {
    const mockUser = { id: "123", name: "Test User" };

    renderWithAuth(mockUser);

    expect(screen.getByText("Protected Routes")).toBeInTheDocument();
    expect(screen.getByText("Public Routes")).toBeInTheDocument();
  });
});
