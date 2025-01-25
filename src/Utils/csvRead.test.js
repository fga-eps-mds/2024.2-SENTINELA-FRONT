import { readcsv } from "./csvRead";
import { getUsers, patchUserById } from "../Services/userService";
import Papa from "papaparse";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock da função getRoleById
vi.mock("../Services/userService", () => ({
  getUsers: vi.fn(),
  patchUserById: vi.fn(),
}));

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
    },
    {
      _id: "user2",
      name: "User Two",
      email: "user2@example.com",
      phone: "987654321",
      status: "inactive",
      role: { name: "não sindicalizado" },
      situation: "Pendente",
    },
  ];

  const mockCsvData = [
    { nome: "User One", status_parc_holerite: "Quitado" },
    { nome: "User Two", status_parc_holerite: "Pendente" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue(mockUsers);

    vi.spyOn(Papa, "parse").mockImplementation((file, options) => {
      options.complete({ data: mockCsvData });
    });

    vi.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  it("deve atualizar a situação dos usuários corretamente", async () => {
    patchUserById.mockResolvedValue({});

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });
    const result = await readcsv(file);

    expect(getUsers).toHaveBeenCalled();
    expect(Papa.parse).toHaveBeenCalledWith(file, expect.any(Object));

    expect(patchUserById).toHaveBeenCalledTimes(1);
    expect(patchUserById).toHaveBeenCalledWith("user1", {
      name: "User One",
      email: "user1@example.com",
      phone: "123456789",
      status: "active",
      role: { name: "sindicalizado" },
      situation: "Quitado",
    });

    expect(result).toEqual(mockCsvData);
  });

  it("deve lançar um erro se nenhum arquivo for fornecido", async () => {
    await expect(readcsv(null)).rejects.toThrow("Nenhum arquivo selecionado.");
  });

  it("deve lançar um erro se os usuários não forem um array", async () => {
    getUsers.mockResolvedValue(null);
    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });

    await expect(readcsv(file)).rejects.toThrow(
      "Os dados recebidos não são um array."
    );
  });

  it("deve lidar com erro ao atualizar o usuário", async () => {
    patchUserById.mockRejectedValue(new Error("Erro ao atualizar"));

    const file = new File(["mock csv content"], "mockfile.csv", {
      type: "text/csv",
    });
    await readcsv(file);

    expect(patchUserById).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Erro ao atualizar usuário com ID user1:`,
      expect.any(Error)
    );
  });
});
