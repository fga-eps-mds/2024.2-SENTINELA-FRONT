import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransactionTable from ".";

describe("TransactionTable", () => {
  it("renders correctly with no transactions", () => {
    render(
      <TransactionTable
        transactions={[]}
        openModal={vi.fn()}
        isMissing={false}
      />
    );

    expect(screen.getByText("Nenhum dado encontrado.")).toBeInTheDocument();
  });

  it("renders correctly with transactions and isMissing=false", () => {
    const transactions = [
      {
        name: "John Doe",
        oldSituation: "pendente",
        newSituation: "quitado",
      },
      {
        name: "Jane Smith",
        oldSituation: "desfiliado",
        newSituation: "pendente",
      },
    ];

    render(
      <TransactionTable
        transactions={transactions}
        openModal={vi.fn()}
        isMissing={false}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Verificar texto específico dentro do contexto da tabela
    const table = screen.getByRole("table");
    const cells = within(table).getAllByText("pendente");
    expect(cells).toHaveLength(2);

    expect(screen.getByText("quitado")).toBeInTheDocument();
  });

  it("renders correctly with transactions and isMissing=true", () => {
    const transactions = [
      {
        name: "John Doe",
        cpf_servidor: "123.456.789-00",
        matricula_servidor: "12345",
      },
    ];

    render(
      <TransactionTable
        transactions={transactions}
        openModal={vi.fn()}
        isMissing={true}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
  });

  it("calls openModal when icon is clicked", () => {
    const transactions = [
      {
        name: "John Doe",
        oldSituation: "pendente",
        newSituation: "quitado",
      },
    ];
    const openModalMock = vi.fn();

    render(
      <TransactionTable
        transactions={transactions}
        openModal={openModalMock}
        isMissing={false}
      />
    );

    const iconButton = screen.getByText("🔍");
    fireEvent.click(iconButton);

    expect(openModalMock).toHaveBeenCalledWith(
      "clientModalVisible",
      transactions[0]
    );
  });
});
