import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { APIBank } from "../../../Services/BaseService";
import {
  createFinancialMovements,
  updateFinancialMovementsById,
} from "../../../Services/FinancialMovementsService";
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

it("handles file upload and processes transactions", async () => {
    render(<DataImport />);

    const fileInput = screen.getByLabelText("SELECIONE UM ARQUIVO");
    const file = new Blob([`
        <OFX>
            <STMTTRN>
                <DTPOSTED>20240101</DTPOSTED>
                <TRNAMT>100.00</TRNAMT>
                <NAME>Test Transaction</NAME>
                <MEMO>Test Memo</MEMO>
            </STMTTRN>
        </OFX>
    `], { type: 'application/ofx' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
        const transactionInput = screen.getByDisplayValue("Test Transaction");
        const amountInput = screen.getByDisplayValue("100.00");
        const dateInput = screen.getByDisplayValue("01/01/2024");

        console.log(transactionInput);
        console.log(amountInput);
        console.log(dateInput);

        expect(transactionInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
    });
});


it("fetches transactions from API on mount", async () => {
    APIBank.get.mockResolvedValueOnce({
        data: [
            {
                datadePagamento: "2024-01-01T00:00:00Z",
                valorBruto: 100,
                tipoDocumento: " ",
                descricao: "Mock Transaction",
                gastoFixo: false,
                _id: "123",
            },
        ],
    });

    render(<DataImport />);

    await waitFor(() => {
        expect(screen.getByText("100.00")).toBeInTheDocument();
        expect(screen.getByText("Mock Transaction")).toBeInTheDocument();
    });
});

it("fetches transactions from API on mount", async () => {
    APIBank.get.mockResolvedValueOnce({
        data: [
            {
                datadePagamento: "2024-01-01T00:00:00Z",
                valorBruto: 100,
                tipoDocumento: " ",
                descricao: "Mock Transaction",
                gastoFixo: false,
                _id: "123",
            },
        ],
    });

    render(<DataImport />);

    await waitFor(() => {
        expect(screen.getByText("100.00")).toBeInTheDocument();
        expect(screen.getByText("Mock Transaction")).toBeInTheDocument();
    });
});
