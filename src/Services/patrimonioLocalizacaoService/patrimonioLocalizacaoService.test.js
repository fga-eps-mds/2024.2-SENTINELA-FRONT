import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createpatrimonioLocalizacao,
  getpatrimonioLocalizacao,
  getpatrimonioLocalizacaoById,
  updatepatrimonioLocalizacaoById,
  deletepatrimonioLocalizacaoById,
} from "./index"; // Importando funções diretamente

// Mock das funções para evitar chamadas reais à API
vi.mock("./index", () => ({
  createpatrimonioLocalizacao: vi.fn(),
  getpatrimonioLocalizacao: vi.fn(),
  getpatrimonioLocalizacaoById: vi.fn(),
  updatepatrimonioLocalizacaoById: vi.fn(),
  deletepatrimonioLocalizacaoById: vi.fn(),
}));

describe("PatrimonioLocalizacao Service", () => {
  const patrimonioLocalizacaoData = {
    nome: "Localização A",
    descricao: "Descrição A",
    setor: "Administrativo",
    andar: "1º Andar",
    ativo: true,
  };
  const patrimonioLocalizacaoId = "123";

  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("should create a patrimonioLocalizacao successfully", async () => {
    createpatrimonioLocalizacao.mockResolvedValue(false); // Mocka um retorno válido

    const result = await createpatrimonioLocalizacao(patrimonioLocalizacaoData);

    expect(result).toBe(false);
    expect(createpatrimonioLocalizacao).toHaveBeenCalledTimes(1);
    expect(createpatrimonioLocalizacao).toHaveBeenCalledWith(
      patrimonioLocalizacaoData
    );
  });

  it("should fetch all patrimonioLocalizacoes", async () => {
    const mockPatrimonioLocalizacoes = [patrimonioLocalizacaoData]; // Dados fictícios
    getpatrimonioLocalizacao.mockResolvedValue(mockPatrimonioLocalizacoes);

    const result = await getpatrimonioLocalizacao();

    expect(result).toEqual(mockPatrimonioLocalizacoes);
    expect(getpatrimonioLocalizacao).toHaveBeenCalledTimes(1);
  });

  it("should fetch a patrimonioLocalizacao by id", async () => {
    getpatrimonioLocalizacaoById.mockResolvedValue(patrimonioLocalizacaoData);

    const result = await getpatrimonioLocalizacaoById(patrimonioLocalizacaoId);

    expect(result).toEqual(patrimonioLocalizacaoData);
    expect(getpatrimonioLocalizacaoById).toHaveBeenCalledTimes(1);
    expect(getpatrimonioLocalizacaoById).toHaveBeenCalledWith(
      patrimonioLocalizacaoId
    );
  });

  it("should update a patrimonioLocalizacao", async () => {
    const updatedData = { ...patrimonioLocalizacaoData, nome: "Localização B" };
    updatepatrimonioLocalizacaoById.mockResolvedValue(updatedData);

    const result = await updatepatrimonioLocalizacaoById(
      patrimonioLocalizacaoId,
      updatedData
    );

    expect(result).toEqual(updatedData);
    expect(updatepatrimonioLocalizacaoById).toHaveBeenCalledTimes(1);
    expect(updatepatrimonioLocalizacaoById).toHaveBeenCalledWith(
      patrimonioLocalizacaoId,
      updatedData
    );
  });

  it("should delete a patrimonioLocalizacao by id", async () => {
    deletepatrimonioLocalizacaoById.mockResolvedValue(undefined); // Simula sucesso na exclusão

    const result = await deletepatrimonioLocalizacaoById(
      patrimonioLocalizacaoId
    );

    expect(result).toBeUndefined();
    expect(deletepatrimonioLocalizacaoById).toHaveBeenCalledTimes(1);
    expect(deletepatrimonioLocalizacaoById).toHaveBeenCalledWith(
      patrimonioLocalizacaoId
    );
  });
});
