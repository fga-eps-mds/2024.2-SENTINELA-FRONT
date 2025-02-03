import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PermissionCRUD from "./../Pages/Protected/Permissions/permissionsHandler";
import * as BaseService from "./../Services/BaseService/index";
import * as LoaderFunctions from "./../Services/Functions/loader";
import * as PermissionUtils from "../Utils/permission";

BaseService.APIUsers = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};
LoaderFunctions.getToken = jest.fn();
PermissionUtils.checkAction = jest.fn();

describe("PermissionCRUD Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  test('deve renderizar o título corretamente', () => {
    render(<PermissionCRUD />);
    const title = screen.getByText(/Permission Management/i);
    expect(title).toBeInTheDocument();
  });
  

  test("deve chamar fetchPermissions ao carregar o componente", async () => {
    BaseService.APIUsers.get.mockResolvedValueOnce({ data: [] });
    render(<PermissionCRUD />);
    await waitFor(() => expect(BaseService.APIUsers.get).toHaveBeenCalledTimes(1));
  });

  test("deve permitir a criação de permissões se o usuário tiver permissão", async () => {
    PermissionUtils.checkAction.mockReturnValueOnce(true); // Simula permissão
    render(<PermissionCRUD />);
    const input = screen.getByLabelText(/Permission Name/i);
    const button = screen.getByText(/Criar Permissão/i);

    fireEvent.change(input, { target: { value: "Nova Permissão" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(BaseService.APIUsers.post).toHaveBeenCalledWith(
        "permission/create/",
        { name: "Nova Permissão" }
      );
    });
  });

  test("deve exibir permissões na tabela", async () => {
    const mockPermissions = [{ _id: "1", name: "Admin" }];
    BaseService.APIUsers.get.mockResolvedValueOnce({ data: mockPermissions });
    render(<PermissionCRUD />);
    await waitFor(() => {
      const permissionName = screen.getByText(/Admin/i);
      expect(permissionName).toBeInTheDocument();
    });
  });
});
