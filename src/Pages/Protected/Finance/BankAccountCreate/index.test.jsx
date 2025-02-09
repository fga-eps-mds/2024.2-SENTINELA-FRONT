import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom";
import BankAccountCreate from "./index";
import { useAuth } from "../../../../Context/auth";

vi.mock("../../../../Context/auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../../Services/bankAccountService", () => ({
  createBankAccount: vi.fn(),
}));

vi.mock("../../../../Utils/permission", () => ({
  checkAction: vi.fn(() => true), // Garante que o componente renderiza
}));

describe("BankAccountCreate Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the form correctly when user is authenticated", () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: "Test User" },
    });

    render(
      <Router>
        <BankAccountCreate />
      </Router>
    );

    expect(screen.getByText(/Cadastro de Conta Bancária/i)).toBeInTheDocument();
  });

  it("shows error message when required fields are missing", () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: "Test User" },
    });

    render(
      <Router>
        <BankAccountCreate />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(
      screen.getByText(
        "Certifique-se de que todos os campos obrigatórios estão preenchidos"
      )
    ).toBeInTheDocument();
  });

  it("applies masks correctly", () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: "Test User" },
    });

    render(
      <Router>
        <BankAccountCreate />
      </Router>
    );

    const agenciaInput = screen.getByLabelText(/agência/i);
    const numeroContaInput = screen.getByLabelText(/número da conta/i);
    const dvInput = screen.getByLabelText(/dv/i);

    fireEvent.change(agenciaInput, { target: { value: "123456" } });
    expect(agenciaInput.value).toBe("12345");

    fireEvent.change(numeroContaInput, { target: { value: "123456789012" } });
    expect(numeroContaInput.value).toBe("12345678901");

    fireEvent.change(dvInput, { target: { value: "123" } });
    expect(dvInput.value).toBe("1");
  });
});
