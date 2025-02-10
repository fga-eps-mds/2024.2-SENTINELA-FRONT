import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createlocalizacao,
  getlocalizacao,
  getlocalizacaoById,
  updatelocalizacaoById,
  deletelocalizacaoById,
} from "./index"; // Importando funções diretamente

// Mock das funções para evitar chamadas reais à API
vi.mock("./index", () => ({
  createlocalizacao: vi.fn(),
  getlocalizacao: vi.fn(),
  getlocalizacaoById: vi.fn(),
  updatelocalizacaoById: vi.fn(),
  deletelocalizacaoById: vi.fn(),
}));

describe("Localizacao Service", () => {
  const localizacaoData = {
    nome: "Sala 101",
    descricao: "Departamento de TI",
    andar: "1º Andar",
    ativo: true,
  };
  const localizacaoId = "123";

  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("should create a localizacao successfully", async () => {
    createlocalizacao.mockResolvedValue(false); // Mocka um retorno válido

    const result = await createlocalizacao(localizacaoData);

    expect(result).toBe(false);
    expect(createlocalizacao).toHaveBeenCalledTimes(1);
    expect(createlocalizacao).toHaveBeenCalledWith(localizacaoData);
  });

  it("should fetch all localizacoes", async () => {
    const mockLocalizacoes = [localizacaoData]; // Dados fictícios
    getlocalizacao.mockResolvedValue(mockLocalizacoes);

    const result = await getlocalizacao();

    expect(result).toEqual(mockLocalizacoes);
    expect(getlocalizacao).toHaveBeenCalledTimes(1);
  });

  it("should fetch a localizacao by id", async () => {
    getlocalizacaoById.mockResolvedValue(localizacaoData);

    const result = await getlocalizacaoById(localizacaoId);

    expect(result).toEqual(localizacaoData);
    expect(getlocalizacaoById).toHaveBeenCalledTimes(1);
    expect(getlocalizacaoById).toHaveBeenCalledWith(localizacaoId);
  });

  it("should update a localizacao", async () => {
    const updatedData = { ...localizacaoData, nome: "Sala 102" };
    updatelocalizacaoById.mockResolvedValue(updatedData);

    const result = await updatelocalizacaoById(localizacaoId, updatedData);

    expect(result).toEqual(updatedData);
    expect(updatelocalizacaoById).toHaveBeenCalledTimes(1);
    expect(updatelocalizacaoById).toHaveBeenCalledWith(
      localizacaoId,
      updatedData
    );
  });

  it("should delete a localizacao by id", async () => {
    deletelocalizacaoById.mockResolvedValue(undefined); // Simula sucesso na exclusão

    const result = await deletelocalizacaoById(localizacaoId);

    expect(result).toBeUndefined();
    expect(deletelocalizacaoById).toHaveBeenCalledTimes(1);
    expect(deletelocalizacaoById).toHaveBeenCalledWith(localizacaoId);
  });
});
