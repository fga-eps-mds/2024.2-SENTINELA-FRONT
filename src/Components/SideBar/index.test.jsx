import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import SideBar from "./index";
import AuthContext from "../../Context/auth";
import { usePermissions } from "../../Utils/permission";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../Utils/permission", () => ({
  usePermissions: vi.fn(),
  checkModule: vi.fn(() => true),
}));

describe("SideBar Component", () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();

  const renderSideBar = (user = null) => {
    useNavigate.mockReturnValue(mockNavigate);
    usePermissions.mockReturnValue([]);

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user,
            Logout: mockLogout,
          }}
        >
          <SideBar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should open sidebar when clicking the first button (menu icon)", () => {
    renderSideBar();

    const menuIcon = screen.getAllByRole("button")[0];
    fireEvent.click(menuIcon);

    expect(screen.getByText("PÁGINA INICIAL")).toBeInTheDocument();
  });

  it("should navigate to 'PÁGINA INICIAL' when button is clicked", () => {
    renderSideBar();

    const menuIcon = screen.getAllByRole("button")[0];
    fireEvent.click(menuIcon);

    const homeButton = screen.getByText("PÁGINA INICIAL");
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("should display user information when user is logged in", () => {
    const mockUser = { name: "John Doe", role: "admin" };
    renderSideBar(mockUser);

    expect(
      screen.getByText("Você está logado como John Doe")
    ).toBeInTheDocument();
  });

  it("should call Logout and navigate to '/' on logout", () => {
    const mockUser = { name: "John Doe" };
    renderSideBar(mockUser);

    const logoutButton = screen.getByText("LOGOUT");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to 'FILIAÇÃO' when button is clicked", () => {
    renderSideBar();

    const menuIcon = screen.getAllByRole("button")[0];
    fireEvent.click(menuIcon);

    const filiationButton = screen.getByText("FILIAÇÃO");
    fireEvent.click(filiationButton);

    expect(mockNavigate).toHaveBeenCalledWith("/filiacao");
  });

  it("should hide restricted buttons if user has no permissions", () => {
    usePermissions.mockReturnValue([]);

    renderSideBar();

    const menuIcon = screen.getAllByRole("button")[0];
    fireEvent.click(menuIcon);

    const cadastrosButton = screen.getByText("CADASTROS");
    expect(cadastrosButton).toBeInTheDocument();

    const beneficiosButton = screen.getByText("BENEFÍCIOS");
    expect(beneficiosButton).toBeInTheDocument();
  });
});
