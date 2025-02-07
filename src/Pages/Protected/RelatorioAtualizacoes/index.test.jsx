import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import DataImport from ".";
import { readcsv } from "../../../Utils/csvRead";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock das funções externas
vi.mock("../../../Utils/csvRead", () => ({
  readcsv: vi.fn(),
}));

vi.mock("../../../Services/userService", () => ({
  patchUserById: vi.fn(),
}));

describe("DataImport Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const user = userEvent.setup();
  it("renders correctly with no transactions", () => {
    render(<DataImport />);
    expect(screen.getByText("Relatório de Atualizações")).toBeInTheDocument();
    expect(screen.getByText("Usuários Faltando")).toBeInTheDocument();
    expect(screen.getByText("Usuários Atualizados")).toBeInTheDocument();
    expect(screen.getByText("Importar Arquivo CSV")).toBeInTheDocument();
  });

  it("handles file upload correctly", async () => {
    const mockCsvResult = {
      missingUsers: [{ name: "John Doe", cpf_servidor: "123456789" }],
      updatedUsers: [
        { name: "Jane Doe", cpf: "987654321", newSituation: "Pendente" },
      ],
    };

    readcsv.mockResolvedValue(mockCsvResult);

    render(<DataImport />);
    const input = screen.getByTestId("upInput");
    const file = new File(["mock content"], "test.csv", { type: "text/csv" });
    user.upload(input, file);

    await waitFor(() => expect(readcsv).toHaveBeenCalledWith(file, ";"));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("opens and closes the modals correctly", async () => {
    const mockCsvResult = {
      missingUsers: [{ name: "John Doe", cpf_servidor: "123456789" }],
      updatedUsers: [
        { name: "Jane Doe", cpf: "987654321", newSituation: "Pendente" },
      ],
    };

    readcsv.mockResolvedValue(mockCsvResult);

    render(<DataImport />);
    const input = screen.getByTestId("upInput");
    const file = new File(["mock content"], "test.csv", { type: "text/csv" });
    user.upload(input, file);

    await waitFor(() => expect(readcsv).toHaveBeenCalledWith(file, ";"));
    const openModalButton = screen.getByTestId("upModal");

    fireEvent.click(openModalButton);
    expect(screen.getByText("TITULAR")).toBeInTheDocument();

    fireEvent.click(screen.getByText("VOLTAR"));
    expect(screen.queryByText("TITULAR")).not.toBeInTheDocument();
  });
});
