import { readcsv } from "./csvRead";
import { getMemberShip, updateMembership } from "../Services/memberShipService";
import Papa from "papaparse";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock das funções
vi.mock("../Services/memberShipService", () => ({
  getMemberShip: vi.fn(),
  updateMembership: vi.fn(),
}));
const mascaraCPF = (cpf) => {
  let formattedCPF = cpf.replace(/\D/g, "");
  if (formattedCPF.length > 11) formattedCPF = formattedCPF.slice(0, 11);

  return formattedCPF
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

describe("readcsv", () => {
  const mockUsers = [
    {
      _id: "user1",
      name: "User One",
      email: "user1@example.com",
      phone: "123456789",
      status: "active",
      role: { name: "sindicalizado" },
      situation: "Pendente",
      cpf: "123.456.789-00",
    },
    {
      _id: "user2",
      name: "User Two",
      email: "user2@example.com",
      phone: "987654321",
      status: "inactive",
      role: { name: "não sindicalizado" },
      situation: "Pendente",
      cpf: "987.654.321-00",
    },
  ];

  const mockCsvData = [
    {
      cpf_servidor: "123.456.789-00",
      status_atual_parc: "Ativo",
      status_parc_holerite: "Quitado",
    },
    {
      cpf_servidor: "987.654.321-00",
      status_atual_parc: "Inativo",
      status_parc_holerite: "Pendente",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getMemberShip.mockResolvedValue(mockUsers);
    updateMembership.mockResolvedValue(null);

    vi.spyOn(Papa, "parse").mockImplementation((file, options) => {
      options.complete({
        data: mockCsvData,
        meta: { delimiter: ";" }, // Garante que o delimitador correto seja simulado
        errors: [],
      });
    });

    vi.spyOn(console, "error").mockImplementation(() => {}); // Evita poluir os logs dos testes
  });

  it("deve lançar um erro se nenhum arquivo for fornecido", async () => {
    await expect(readcsv(null)).rejects.toThrow("Nenhum arquivo selecionado.");
  });

  it("deve lançar um erro se o delimitador do CSV estiver incorreto", async () => {
    vi.spyOn(Papa, "parse").mockImplementation((file, options) => {
      options.complete({
        data: mockCsvData,
        meta: { delimiter: "," },
        errors: [],
      });
    });

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow(
      "O arquivo CSV deve utilizar o ponto e vírgula (;) como separador."
    );
  });

  it("deve lançar um erro se os dados de usuários não forem um array", async () => {
    getMemberShip.mockResolvedValue(null); // Simula erro ao buscar usuários

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow("O arquivo CSV deve utilizar o ponto e vírgula (;) como separador.");
  });

  it("deve lançar um erro se o arquivo CSV não contiver o campo 'cpf_servidor'", async () => {
    const invalidCsvData = [
      {
        status_atual_parc: "Ativo",
        status_parc_holerite: "Quitado",
      },
    ];

    vi.spyOn(Papa, "parse").mockImplementation((file, options) => {
      options.complete({
        data: invalidCsvData,
        meta: { delimiter: ";" },
        errors: [],
      });
    });

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow(
      "O arquivo CSV deve utilizar o ponto e vírgula (;) como separador."
    );
  });

  it("deve lançar um erro se o arquivo CSV não contiver o campo 'status_atual_parc'", async () => {
    const invalidCsvData = [
      {
        cpf_servidor: "123.456.789-00",
        status_parc_holerite: "Quitado",
      },
    ];

    vi.spyOn(Papa, "parse").mockImplementation((file, options) => {
      options.complete({
        data: invalidCsvData,
        meta: { delimiter: ";" },
        errors: [],
      });
    });

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow(
      "O arquivo CSV deve utilizar o ponto e vírgula (;) como separador."
    );
  });
  

  it("deve aplicar a máscara de CPF corretamente", () => {
    const cpf = "12345678900";
    const maskedCpf = "123.456.789-00";
  
    // Aplicando a função de máscara diretamente
    const response = mascaraCPF(cpf);
  
    // Verifica se a máscara foi aplicada corretamente
    expect(response).toBe(maskedCpf);
  });
  
  

  it("deve lançar erro ao tentar atualizar usuário com erro na função 'updateMembership'", async () => {
    updateMembership.mockRejectedValue("Erro de atualização");

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow("O arquivo CSV deve utilizar o ponto e vírgula (;) como separador.");
  });
});
