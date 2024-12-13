import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import UserUpdatePage from "./index";
import {
  getRoles,
  getLoggedUser,
  updateLogged,
  changePasswordInProfile,
} from "../../../../Services/userService";
import "@testing-library/jest-dom";

vi.mock("../../../../Services/userService", () => ({
  getRoles: vi.fn(),
  getLoggedUser: vi.fn(),
  updateLogged: vi.fn(),
  changePasswordInProfile: vi.fn(),
}));

describe("UserUpdatePage", () => {
  const setup = () => {
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
    return render(
      <Router>
        <UserUpdatePage />
      </Router>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders correctly with initial data", async () => {
    getRoles.mockResolvedValueOnce([{ _id: "1", name: "Admin" }]);
    getLoggedUser.mockResolvedValueOnce({
      name: "John Doe",
      phone: "1234567890",
      status: true,
      email: "john.doe@example.com",
      role: { _id: "1" },
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText("Editar usuário")).toBeInTheDocument();
      expect(screen.getByText("Editar senha")).toBeInTheDocument();
      expect(screen.getByLabelText("Nome Completo")).toHaveValue("John Doe");
      expect(screen.getByLabelText("Email")).toHaveValue(
        "john.doe@example.com"
      );
      expect(screen.getByLabelText("Celular")).toHaveValue("(12) 3456-7890");
    });
  });

  it("validates email input", async () => {
    getRoles.mockResolvedValueOnce([]);
    getLoggedUser.mockResolvedValueOnce({
      name: "",
      phone: "",
      status: true,
      email: "",
      role: "",
    });

    setup();

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("*Insira um email válido")).toBeInTheDocument();
    });
  });

  it("validates phone number input", async () => {
    getRoles.mockResolvedValueOnce([]);
    getLoggedUser.mockResolvedValueOnce({
      name: "",
      phone: "",
      status: true,
      email: "",
      role: "",
    });

    setup();

    const phoneInput = screen.getByLabelText("Celular");
    fireEvent.change(phoneInput, { target: { value: "123" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "*Verifique se o número de celular inserido está completo"
        )
      ).toBeInTheDocument();
    });
  });

  it("saves user data correctly", async () => {
    getRoles.mockResolvedValueOnce([{ _id: "1", name: "Admin" }]);
    getLoggedUser.mockResolvedValueOnce({
      name: "John Doe",
      phone: "1234567890",
      status: true,
      email: "john.doe@example.com",
      role: { _id: "1" },
    });

    setup();

    fireEvent.change(screen.getByLabelText("Nome Completo"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Celular"), {
      target: { value: "0987654321" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane.doe@example.com" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(updateLogged).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "0987654321",
        status: true,
        role: "1",
      });
      expect(screen.getByText("Alterações Salvas")).toBeInTheDocument();
    });
  });

  it("saves password correctly", async () => {
    setup();

    fireEvent.click(screen.getByText("Editar senha"));
    fireEvent.change(screen.getByLabelText("Senha atual"), {
      target: { value: "oldPassword123" },
    });
    fireEvent.change(screen.getByLabelText("Nova senha"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(screen.getByLabelText("Repetir nova senha"), {
      target: { value: "newPassword123" },
    });

    fireEvent.click(screen.getByText("Alterar senha"));

    await waitFor(() => {
      expect(changePasswordInProfile).toHaveBeenCalledWith({
        old_password: "oldPassword123",
        new_password: "newPassword123",
      });
      expect(screen.getByText("Alterações Salvas")).toBeInTheDocument();
    });
  });
});
