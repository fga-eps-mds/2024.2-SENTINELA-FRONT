import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RolesUpdatePage from "../RolesUpdatePage/index";
import { useNavigate, useLocation } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import {
  getRoleById,
  deleteRole,
} from "../../../../Services/RoleService/roleService";
import {
  getAllPermissions,
  searchPermissionByName,
} from "../../../../Services/Permissions/permissionsService";

// Mock das funções de API
vi.mock("../../../../Services/RoleService/roleService", () => ({
  getRoleById: vi.fn(),
  updateRole: vi.fn(),
  deleteRole: vi.fn(),
  assignPermissionsToRole: vi.fn(),
}));

vi.mock("../../../../Services/Permissions/permissionsService", () => ({
  getAllPermissions: vi.fn(),
  searchPermissionByName: vi.fn(),
}));

// Mock do react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe("RolesUpdatePage", () => {
  const mockNavigate = vi.fn();
  const mockLocation = { state: { roleId: "123" } };

  beforeEach(() => {
    // Configura os mocks antes de cada teste
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);

    // Mock das funções de API
    getRoleById.mockResolvedValue({
      name: "Admin",
      permissions: [{ _id: "perm1" }, { _id: "perm2" }],
    });

    getAllPermissions.mockResolvedValue([
      { _id: "perm1", name: "Permission 1" },
      { _id: "perm2", name: "Permission 2" },
    ]);

    searchPermissionByName.mockResolvedValue([
      { _id: "perm1", name: "Permission 1" },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o componente corretamente", async () => {
    render(<RolesUpdatePage />);

    // Verifica se o título da página está presente
    expect(screen.getByText("Atualização de Perfil")).toBeInTheDocument();

    // Verifica se o nome do perfil é carregado corretamente
    await waitFor(() => {
      expect(screen.getByDisplayValue("Admin")).toBeInTheDocument();
    });

    // Verifica se as permissões são carregadas
    expect(screen.getByText("Permission 1")).toBeInTheDocument();
    expect(screen.getByText("Permission 2")).toBeInTheDocument();
  });

  it("deve atualizar o nome do perfil", async () => {
    render(<RolesUpdatePage />);

    // Simula a alteração do nome do perfil
    const input = screen.getByLabelText("Nome do Perfil");
    fireEvent.change(input, { target: { value: "Novo Nome" } });

    // Verifica se o valor foi atualizado
    expect(input.value).toBe("Novo Nome");
  });

  it("deve selecionar e deselecionar permissões", async () => {
    render(<RolesUpdatePage />);

    // Aguarda o carregamento das permissões
    // Verifica se está desmarcado
    await waitFor(() => {
      expect(screen.getByLabelText("Permission 1")).toBeChecked();
    });

    // Simula o clique
    fireEvent.click(screen.getByLabelText("Permission 1"));

    // Verifica se foi marcado
    await waitFor(() => {
      expect(screen.getByLabelText("Permission 1")).not.toBeChecked();
    });

    // Simula o clique novamente
    fireEvent.click(screen.getByLabelText("Permission 1"));

    // Verifica se foi desmarcado
    await waitFor(() => {
      expect(screen.getByLabelText("Permission 1")).toBeChecked();
    });
  });

  it("deve abrir e fechar o modal de confirmação de exclusão", async () => {
    render(<RolesUpdatePage />);

    // Simula o clique no botão de deletar
    const deleteButton = screen.getByText("DELETAR");
    fireEvent.click(deleteButton);

    // Verifica se o modal de confirmação de exclusão foi aberto
    expect(screen.getByText("Confirmação de exclusão")).toBeInTheDocument();

    // Simula o clique no botão de cancelar
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    // Verifica se o modal foi fechado
    expect(
      screen.queryByText("Confirmação de exclusão")
    ).not.toBeInTheDocument();
  });

  it("deve deletar o perfil e redirecionar para a página de perfis", async () => {
    render(<RolesUpdatePage />);

    // Simula o clique no botão de deletar
    const deleteButton = screen.getByText("DELETAR");
    fireEvent.click(deleteButton);

    // Simula o clique no botão de confirmar exclusão
    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    // Verifica se a função de deletar foi chamada
    await waitFor(() => {
      expect(deleteRole).toHaveBeenCalledWith("123");
    });

    // Verifica se o modal de sucesso foi aberto
    expect(
      screen.getByText("Perfil deletado com sucesso!")
    ).toBeInTheDocument();

    // Simula o clique no botão "Ok" do modal de sucesso
    const okButton = screen.getByText("Ok");
    fireEvent.click(okButton);

    // Verifica se o redirecionamento ocorreu
    expect(mockNavigate).toHaveBeenCalledWith("/perfis");
  });
});
