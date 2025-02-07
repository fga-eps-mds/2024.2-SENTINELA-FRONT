import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import patrimonioCreate from "./index.jsx";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock para o hook useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

function mockServices() {
  vi.mock("../../../../Services/patrimonioService", () => ({
    createpatrimonio: vi.fn(),
  }));
}

// Função auxiliar para preencher campos obrigatórios
async function fillUpRequiredFields() {
  try {
    const nomeInput = await screen.findByLabelText("Nome *");
    const descricaoInput = await screen.findByLabelText("Descrição *");
    const valorInput = await screen.findByLabelText("Valor *");
    const numerodeSerieInput = await screen.findByLabelText("Numero de Serie");
    const numerodeEtiquetaInput = await screen.findByLabelText("Etiqueta de Patrimônio");
    const localizacaoSelect = await screen.findByLabelText("Localização *");

    // Simulando seleção de opções e preenchimento de campos
    await userEvent.type(nomeInput, "Nome Exemplo");
    await userEvent.type(descricaoInput, "Descrição de exemplo");
    await userEvent.type(valorInput, "1000");
    await userEvent.type(numerodeSerieInput, "12345");
    await userEvent.type(numerodeEtiquetaInput, "0001");
    await userEvent.selectOptions(localizacaoSelect, "OUTROS");
  } catch (error) {
    console.error("Erro ao preencher campos:", error);
  }
}

describe("patrimonioCreate Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockServices();
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));

    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate); // Configurando o mock do useNavigate

    render(
      <Router>
        <patrimonioCreate />
      </Router>
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("render patrimonioCreate page correctly", () => {
    expect(screen).toMatchSnapshot();
  });

});

it("should validate mandatory fields before submitting", async () => {
  await fillUpRequiredFields();

  // Submetendo após preencher todos os campos obrigatórios
  //await userEvent.click(screen.getByText("Cadastrar"));
  await waitFor(() => expect(screen.getByText("Cadastrar")).toBeInTheDocument());
  userEvent.click(screen.getByText("Cadastrar"));

  await waitFor(() => {
    expect(createpatrimonio).toHaveBeenCalledTimes(1);
  });

  it("should alert if mandatory fields are not filled", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Tentando submeter sem preencher os campos obrigatórios
    await userEvent.click(screen.getByText("Cadastrar"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Preencha todos os campos obrigatórios!"
      );
    });
  });
});
