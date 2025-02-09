import { render, screen } from "@testing-library/react";
import { vi, describe, afterEach, beforeEach, expect, it } from "vitest";
import DataImport from "./index";
import "@testing-library/jest-dom";

vi.mock("../../../Services/BaseService", () => ({
  APIBank: {
    get: vi.fn(),
  },
}));

vi.mock("../../../Services/FinancialMovementsService", () => ({
  createFinancialMovements: vi.fn(),
  updateFinancialMovementsById: vi.fn(),
}));

describe("DataImport Component", () => {
  beforeEach(() => {
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpa todos os mocks após cada teste
    localStorage.clear(); // Limpa o localStorage após cada teste
  });

  it("renders the component correctly", () => {
    render(<DataImport />);

    // Verifica se os elementos estão sendo renderizados corretamente
    expect(screen.getByText("Importar Extrato Bancário")).toBeInTheDocument();
    expect(screen.getByText("SELECIONE UM ARQUIVO")).toBeInTheDocument();
    expect(screen.getByText("SALVAR")).toBeInTheDocument();
  });
});
