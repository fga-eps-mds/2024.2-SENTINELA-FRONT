import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import UserUpdatePage from "./index";
import {
  getRoles,
  getUserById,
  patchUserById,
} from "../../../../Services/userService";
import "@testing-library/jest-dom";

vi.mock("../../../../Services/userService", () => ({
  getRoles: vi.fn(),
  getUserById: vi.fn(),
  deleteUserById: vi.fn(),
  patchUserById: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => ({
      state: { userId: "123" },
    }),
    useNavigate: vi.fn(), // Mocks useNavigate
  };
});

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
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly", async () => {
    getRoles.mockResolvedValueOnce([]);
    getUserById.mockResolvedValueOnce({
      name: "",
      phone: "",
      status: true,
      email: "",
      role: "",
    });

    setup();

    expect(screen.getByText("Visualização de usuário")).toBeInTheDocument();
    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Celular")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("validates email input", async () => {
    getRoles.mockResolvedValueOnce([]);
    getUserById.mockResolvedValueOnce({
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
    getUserById.mockResolvedValueOnce({
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

  it("saves user data correctly", () => {
    getRoles.mockResolvedValueOnce([{ _id: "1", name: "Admin" }]);
    getUserById.mockResolvedValueOnce({
      name: "John Doe",
      phone: "1234567890",
      status: true,
      email: "john.doe@example.com",
      role: "1",
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

    waitFor(() => {
      expect(patchUserById).toHaveBeenCalledTimes(1);
      expect(patchUserById).toHaveBeenCalledWith(
        "123",
        {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "0987654321",
          status: true,
          role: "1",
        },
        "mock-token"
      );
      expect(screen.getByText("Alterações Salvas")).toBeInTheDocument();
    });
  });

  it("navigates to the contributions page when the button is clicked", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    getRoles.mockResolvedValueOnce([{ _id: "1", name: "Admin" }]);
    getUserById.mockResolvedValueOnce({
      name: "John Doe",
      phone: "1234567890",
      status: true,
      email: "john.doe@example.com",
      role: "1",
    });

    setup();

    await waitFor(() => {
      expect(screen.getByLabelText("Nome Completo")).toHaveValue("John Doe");
    });

    fireEvent.click(screen.getByText("Histórico de Contribuições"));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/movimentacoes/contribuicoes/John Doe`,
      {
        state: {
          userId: "123",
          nomeCompleto: "John Doe",
          celular: "1234567890",
          email: "john.doe@example.com",
          login: "Ativo", // ou o estado correto
          perfilSelecionado: "", // Ajuste conforme o valor real esperado
        },
      }
    );
  });
});
