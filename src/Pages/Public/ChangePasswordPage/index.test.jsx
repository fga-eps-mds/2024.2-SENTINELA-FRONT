import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ChangePasswordPage from "./index";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { verifyToken } from "../../../Services/userService";

// Mock das funções do userService
vi.mock("../../../Services/userService", () => ({
  verifyToken: vi.fn(),
  changePasswordById: vi.fn(),
}));

describe("ChangePasswordPage", () => {

  const renderComponent = (token) => {
    render(
      <MemoryRouter initialEntries={[`/change-password/${token}`]}>
        <Routes>
          <Route path="/change-password/:token" element={<ChangePasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  it("should render the expired message when the token is invalid", async () => {
    verifyToken.mockRejectedValueOnce(new Error("Token inválido"));

    renderComponent("invalid-token");

    await waitFor(() => {
      expect(
        screen.getByText("Essa página expirou ou não existe...")
      ).toBeInTheDocument();
    });

    expect(verifyToken).toHaveBeenCalledWith("invalid-token");
  });
});