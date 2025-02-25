import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Finance from "./index";
import "@testing-library/jest-dom";
import { useAuth } from "../../../../Context/auth";
import * as permissionUtils from "../../../../Utils/permission";

// Mock do hook useAuth
vi.mock("../../../../Context/auth", () => ({
  useAuth: vi.fn(),
}));

vi.spyOn(permissionUtils, "checkAction").mockReturnValue(true);

describe("Finance", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { name: "Test User" }, // Mock do usuário autenticado
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <Router>
        <Finance />
      </Router>
    );
    expect(screen.getByAltText("Sindpol Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Sentinela Logo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lista de Fornecedores" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lista de Contas Bancárias" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lista de Movimentações Financeiras" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerar relatório" })
    ).toBeInTheDocument();
  });
});
