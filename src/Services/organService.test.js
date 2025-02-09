// organService.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { APIUsers } from "./BaseService";
import {
  createOrgan,
  listOrgans,
  updateOrgan,
  deleteOrganById,
} from "./organService";

// Mock da APIUsers
vi.mock("./BaseService", () => ({
  APIUsers: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Organ Service", () => {
  const mockToken = "mockToken";
  const organId = "789";
  const mockUser = { _id: "123456" };

  beforeEach(() => {
    localStorage.setItem("@App:token", mockToken);
    localStorage.setItem("@App:user", JSON.stringify(mockUser));
  });

  afterEach(() => {
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    vi.clearAllMocks();
  });

  it("should throw an error when API call fails", async () => {
    APIUsers.post.mockRejectedValueOnce(new Error("API error"));

    await expect(createOrgan("Financeiro", "Setor 1")).rejects.toThrow(
      "API error"
    );
  });

  it("should throw an error when user is not found", async () => {
    localStorage.removeItem("@App:user");

    await expect(createOrgan("Financeiro", "Setor 1")).rejects.toThrow(
      "Usuário não encontrado ou sem ID."
    );
  });

  it("should return an error message when API call fails during update", async () => {
    const errorResponse = { response: { data: { error: "Update error" } } };
    APIUsers.patch.mockRejectedValueOnce(errorResponse);

    const result = await updateOrgan(organId, { orgao: "Financeiro" });
    expect(result).toBe("Update error");
  });

  it("should throw an error when user is not found for update", async () => {
    localStorage.removeItem("@App:user");

    await expect(updateOrgan(organId, { orgao: "Financeiro" })).rejects.toThrow(
      "Usuário não encontrado ou sem ID."
    );
  });

  it("should return an error message when API call fails during delete", async () => {
    const errorResponse = { response: { data: { error: "Delete error" } } };
    APIUsers.delete.mockRejectedValueOnce(errorResponse);

    const result = await deleteOrganById(organId);
    expect(result).toBe("Delete error");
  });

  it("should throw an error when user is not found for delete", async () => {
    localStorage.removeItem("@App:user");

    await expect(deleteOrganById(organId)).rejects.toThrow(
      "Usuário não encontrado ou sem ID."
    );
  });

  it("should return error message when API call fails during list", async () => {
    const errorResponse = { response: { data: { error: "List error" } } };
    APIUsers.get.mockRejectedValueOnce(errorResponse);

    const result = await listOrgans();
    expect(result).toBe("List error");
  });
});
