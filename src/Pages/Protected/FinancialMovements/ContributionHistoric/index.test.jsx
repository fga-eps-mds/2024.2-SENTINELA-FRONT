import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserHistoric from "./index";
import { getFinancialMovements } from "../../../../Services/FinancialMovementsService";

import "@testing-library/jest-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: vi
      .fn()
      .mockReturnValue({ state: { nomeCompleto: "Test User" } }),
    useNavigate: vi.fn(),
  };
});

vi.mock("../../../../Services/FinancialMovementsService");

describe("UserHistoric", () => {
  beforeEach(() => {
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly", async () => {
    getFinancialMovements.mockResolvedValue([
      {
        _id: "1",
        nomeOrigem: "Test User",
        tipoDocumento: "Receita",
        datadePagamento: "2024-08-01T00:00:00Z",
        valorBruto: 100.0,
      },
    ]);

    render(
      <Router>
        <UserHistoric />
      </Router>
    );

    expect(screen.getByText("Histórico de Contribuições")).toBeInTheDocument();
    expect(screen.getByLabelText("Pesquisar movimentação")).toBeInTheDocument();

    await waitFor(() => expect(getFinancialMovements).toHaveBeenCalledTimes(1));
  });
});
