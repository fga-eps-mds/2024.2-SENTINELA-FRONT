import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createpatrimonio,
  getpatrimonio,
  getpatrimonioById,
  updatepatrimonioById,
  deletepatrimonioById,
} from "./index"; // Importando funções diretamente

// Mock das funções para evitar chamadas reais à API
vi.mock("./index", () => ({
  createpatrimonio: vi.fn(),
  getpatrimonio: vi.fn(),
  getpatrimonioById: vi.fn(),
  updatepatrimonioById: vi.fn(),
  deletepatrimonioById: vi.fn(),
}));

describe("Patrimonio Service", () => {
  const patrimonioData = {
    nome: "Patrimônio A",
    descricao: "Descrição A",
    valor: "100",
    numerodeSerie: "000a",
    numerodeEtiqueta: 1,
    localizacao: "OUTROS",
    doacao: false,
    datadeCadastro: "2025-02-04T00:00:00.00Z",
  };
  const patrimonioId = "789";

  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("should create a patrimonio successfully", async () => {
    createpatrimonio.mockResolvedValue(false); // Mocka um retorno válido

    const result = await createpatrimonio(patrimonioData);

    expect(result).toBe(false);
    expect(createpatrimonio).toHaveBeenCalledTimes(1);
    expect(createpatrimonio).toHaveBeenCalledWith(patrimonioData);
  });

  it("should fetch all patrimonios", async () => {
    const mockPatrimonios = [patrimonioData]; // Dados fictícios
    getpatrimonio.mockResolvedValue(mockPatrimonios);

    const result = await getpatrimonio();

    expect(result).toEqual(mockPatrimonios);
    expect(getpatrimonio).toHaveBeenCalledTimes(1);
  });

  it("should fetch a patrimonio by id", async () => {
    getpatrimonioById.mockResolvedValue(patrimonioData);

    const result = await getpatrimonioById(patrimonioId);

    expect(result).toEqual(patrimonioData);
    expect(getpatrimonioById).toHaveBeenCalledTimes(1);
    expect(getpatrimonioById).toHaveBeenCalledWith(patrimonioId);
  });

  it("should update a patrimonio", async () => {
    const updatedData = { ...patrimonioData, nome: "Patrimônio B" };
    updatepatrimonioById.mockResolvedValue(updatedData);

    const result = await updatepatrimonioById(patrimonioId, updatedData);

    expect(result).toEqual(updatedData);
    expect(updatepatrimonioById).toHaveBeenCalledTimes(1);
    expect(updatepatrimonioById).toHaveBeenCalledWith(patrimonioId, updatedData);
  });

  it("should delete a patrimonio by id", async () => {
    deletepatrimonioById.mockResolvedValue(undefined); // Simula sucesso na exclusão

    const result = await deletepatrimonioById(patrimonioId);

    expect(result).toBeUndefined();
    expect(deletepatrimonioById).toHaveBeenCalledTimes(1);
    expect(deletepatrimonioById).toHaveBeenCalledWith(patrimonioId);
  });
});
