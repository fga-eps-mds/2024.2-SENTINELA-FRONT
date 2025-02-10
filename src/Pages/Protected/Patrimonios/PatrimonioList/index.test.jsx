import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PatrimonioList from "./index.jsx";
import { APIBank } from "../../../../Services/BaseService";

import "@testing-library/jest-dom";

vi.mock("../../../../Services/BaseService");

vi.mock("../../../../Utils/permission", () => ({
  usePermissions: () => ({
    somePermission: true,
  }),
  checkAction: () => true,
}));

describe("patrimonioList", () => {
  beforeEach(() => {
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly", async () => {
    APIBank.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    expect(screen.getByText("Lista de patrimônios")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar patrimonio")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Pesquisar patrimonio por nome")
    ).toBeInTheDocument();

    await waitFor(() => expect(APIBank.get).toHaveBeenCalledTimes(2));
  });

  it("fetches and displays assets", async () => {
    const patrimonio = [
      {
        _id: "1",
        nome: "Patrimonio A",
        descricao: "Descricao A",
        valor: "100",
        numerodeSerie: "000a",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: false,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
      {
        _id: "1",
        nome: "Patrimonio B",
        descricao: "Descricao B",
        valor: "200",
        numerodeSerie: "000b",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: true,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
    ];
    APIBank.get.mockResolvedValue({ data: patrimonio });

    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    await waitFor(() => expect(APIBank.get).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Patrimonio A")).toBeInTheDocument();
    expect(screen.getByText("Patrimonio B")).toBeInTheDocument();
  });

  it("filters assets based on search input (numerodeEtiqueta)", async () => {
    const patrimonio = [
      {
        _id: "1",
        nome: "Patrimonio A",
        descricao: "Descricao A",
        valor: "100",
        numerodeSerie: "000a",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: false,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
      {
        _id: "2",
        nome: "Patrimonio B",
        descricao: "Descricao B",
        valor: "200",
        numerodeSerie: "000b",
        numerodeEtiqueta: "0002",
        localizacao: "OUTROS",
        doacao: true,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
    ];
    APIBank.get.mockResolvedValue({ data: patrimonio });

    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    await waitFor(() => expect(APIBank.get).toHaveBeenCalledTimes(2));

    const searchInput = screen.getByLabelText(
      "Pesquisar patrimonio por etiqueta"
    );
    fireEvent.change(searchInput, { target: { value: "0001" } });

    expect(screen.getByText("Patrimonio A")).toBeInTheDocument();
    expect(screen.queryByText("Patrimonio B")).not.toBeInTheDocument();
  });

  it("filters assets based on search input (nome)", async () => {
    const patrimonio = [
      {
        _id: "1",
        nome: "Patrimonio A",
        descricao: "Descricao A",
        valor: "100",
        numerodeSerie: "000a",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: false,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
      {
        _id: "2",
        nome: "Patrimonio B",
        descricao: "Descricao B",
        valor: "200",
        numerodeSerie: "000b",
        numerodeEtiqueta: "0002",
        localizacao: "OUTROS",
        doacao: true,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
    ];
    APIBank.get.mockResolvedValue({ data: patrimonio });

    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    await waitFor(() => expect(APIBank.get).toHaveBeenCalledTimes(2));

    const searchInput = screen.getByLabelText("Pesquisar patrimonio por nome");
    fireEvent.change(searchInput, { target: { value: "Patrimonio B" } });

    expect(screen.getByText("Patrimonio B")).toBeInTheDocument();
    expect(screen.queryByText("Patrimonio A")).not.toBeInTheDocument();
  });

  it("navigates to asset creation page on button click", async () => {
    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    fireEvent.click(screen.getByText(/Cadastrar patrimonio/i));
    await waitFor(() => {
      expect(window.location.pathname).toBe("/patrimonio/create");
    });
  });

  it("navigates to asset detail page on list item click", async () => {
    const patrimonio = [
      {
        _id: "1",
        nome: "Patrimonio A",
        descricao: "Descricao A",
        valor: "100",
        numerodeSerie: "000a",
        numerodeEtiqueta: "0001",
        localizacao: "OUTROS",
        doacao: false,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
      {
        _id: "2",
        nome: "Patrimonio B",
        descricao: "Descricao B",
        valor: "200",
        numerodeSerie: "000b",
        numerodeEtiqueta: "0002",
        localizacao: "OUTROS",
        doacao: true,
        datadeCadastro: "2025-02-04T00:00:00.00Z",
      },
    ];
    APIBank.get.mockResolvedValue({ data: patrimonio });

    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Patrimonio A"));
    });

    expect(window.location.pathname).toBe(
      `/patrimonio/update/${patrimonio[0]._id}`
    );
  });
  it("see localizacoes on button click", async () => {
    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    fireEvent.click(screen.getByText(/Gerenciar Localizações/i));
    await waitFor(() => {
      expect(screen.getByText("Criar Localização")).toBeInTheDocument();
    });
  });

  it("fechar pop up localizacoes on button click", async () => {
    render(
      <Router>
        <PatrimonioList />
      </Router>
    );

    fireEvent.click(screen.getByText(/Gerenciar Localizações/i));
    await waitFor(() => screen.getByText(/Fechar/i));
    fireEvent.click(screen.getByText(/Fechar/i));
    await waitFor(() => {
      expect(screen.queryByText(/Fechar/i)).not.toBeInTheDocument();
    });
  });
});
