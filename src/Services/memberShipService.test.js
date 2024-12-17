import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMemberShip,
  getMemberShip,
  getMemberShipById,
  updateMemberStatus,
  updateMembership,
  deleteMember,
} from "./memberShipService";
import { APIUsers } from "./BaseService";

vi.mock("../services/BaseService", () => ({
  APIUsers: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("MembershipService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar o status correto ao criar uma filiação", async () => {
    APIUsers.post.mockResolvedValueOnce({ status: 201 });

    const result = await createMemberShip({ name: "John Doe" });

    expect(result).toBe(201);
    expect(APIUsers.post).toHaveBeenCalledWith("membership/create", {
      formData: { name: "John Doe" },
    });
  });

  it("deve retornar dados da filiação com base no status", async () => {
    const mockData = [{ id: 1, status: "active" }];
    APIUsers.get.mockResolvedValueOnce({ data: mockData });

    const result = await getMemberShip("active");

    expect(result).toEqual(mockData);
    expect(APIUsers.get).toHaveBeenCalledWith("membership", {
      params: { status: "active" },
    });
  });

  it("deve retornar dados da filiação pelo ID", async () => {
    const mockData = { id: 1, name: "John Doe" };
    APIUsers.get.mockResolvedValueOnce({ data: mockData });

    const result = await getMemberShipById(1);

    expect(result).toEqual(mockData);
    expect(APIUsers.get).toHaveBeenCalledWith("membership/1");
  });

  it("deve atualizar o status da filiação e retornar dados", async () => {
    const mockResponse = { success: true };
    APIUsers.patch.mockResolvedValueOnce({ data: mockResponse });

    const result = await updateMemberStatus(1, { status: "inactive" });

    expect(result).toEqual(mockResponse);
    expect(APIUsers.patch).toHaveBeenCalledWith("membership/updateStatus/1", {
      formData: { status: "inactive" },
    });
  });

  it("deve retornar false quando atualizar a filiação com sucesso", async () => {
    APIUsers.patch.mockResolvedValueOnce({});

    const result = await updateMembership(1, { name: "John Updated" });

    expect(result).toBe(false);
    expect(APIUsers.patch).toHaveBeenCalledWith("membership/update/1", {
      formData: { name: "John Updated" },
    });
  });

  it("deve retornar false ao deletar a filiação com sucesso", async () => {
    APIUsers.delete.mockResolvedValueOnce({});

    const result = await deleteMember(1);

    expect(result).toBe(false);
    expect(APIUsers.delete).toHaveBeenCalledWith("membership/delete/1");
  });

  it("deve retornar erro ao falhar no createMemberShip", async () => {
    const mockError = { response: { data: { erro: "Erro na requisição" } } };
    APIUsers.post.mockRejectedValueOnce(mockError);

    const result = await createMemberShip({ name: "John Doe" });

    expect(result).toBe("Erro na requisição");
    expect(APIUsers.post).toHaveBeenCalledWith("membership/create", {
      formData: { name: "John Doe" },
    });
  });
});
