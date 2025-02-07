import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PatrimonioUpdate from "./index";
import {
  deletepatrimonioById,
  updatepatrimonioById,
} from "../../../../Services/patrimonioService";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import "@testing-library/jest-dom";

vi.mock("../../../../Utils/permission", () => ({
  usePermissions: () => ({
    somePermission: true,
  }),
  checkAction: () => true,
}));

function mockServices() {
  vi.mock("../../../../Services/patrimonioService", () => ({
    getpatrimonioById: vi.fn(() =>
      Promise.resolve({
        _id: "1",
        nome: "Patrimonio A",
        descricao: "Descricao A",
        valor: "100",
        numerodeSerie: "000a",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: false,
        datadeCadastro: "2025-02-04T00:00:00.00Z"
      })
    ),
    updatepatrimonioById: vi.fn(),
    deletepatrimonioById: vi.fn(),
  }));

  vi.mock("../../../../Services/userService", () => ({
    getUsers: vi.fn(() => Promise.resolve([{ nome: "Nome Exemplo" }])),
  }));

  vi.mock("../../../../Services/supplierService", () => ({
    getSupplierForm: vi.fn(() => Promise.resolve([{ nome: "Nome Exemplo" }])),
  }));
}

describe("PatrimonioUpdate", () => {
  beforeEach(() => {
    mockServices();
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the PatrimonioUpdate page correctly", () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    expect(screen).toMatchSnapshot();
  });

  it("should handle delete button click", async () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    // Open delete modal
    await userEvent.click(screen.getByText("Deletar"));

    // Click the confirm delete button
    await userEvent.click(screen.getByText("EXCLUIR PATRIMONIO"));

    await waitFor(() => {
      expect(deletepatrimonioById).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Patrimonio Deletado")).toBeInTheDocument();
    });
  });

  it("should handle delete button click and CANCELAR", async () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    // Open delete modal
    await userEvent.click(screen.getByText("Deletar"));

    // Click the confirm delete button
    await userEvent.click(screen.getByText("CANCELAR E MANTER PATRIMONIO"));

    await waitFor(() => {
      expect(deletepatrimonioById).toHaveBeenCalledTimes(0);
    });
  });

  it("should handle save button click and call updatePatrimonioById", async () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    await userEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(updatepatrimonioById).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Alterações Salvas")).toBeInTheDocument();
    });
  });

  it("should render labels correctly", () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    screen.debug(); // Verifique o HTML renderizad
  });

  it("should correctly update fields when changing inputs", async () => {
    render(
      <Router>
        <PatrimonioUpdate />
      </Router>
    );

    const descricaoInput = screen.getByLabelText("Nome");

    await userEvent.clear(descricaoInput);
    await userEvent.type(descricaoInput, "Nome alterada");
    expect(descricaoInput.value).toBe("Nome alterada");
  });
});
