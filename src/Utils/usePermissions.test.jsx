import { describe, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PermissionCRUD from "./../Pages/Protected/Permissions/permissionsHandler";
import * as BaseService from "./../Services/BaseService/index";
import * as LoaderFunctions from "./../Services/Functions/loader";
import * as PermissionUtils from "../Utils/permission";
import "@testing-library/jest-dom";

vi.spyOn(BaseService.APIUsers, "get").mockImplementation(() =>
  Promise.resolve({ data: [] })
);
vi.spyOn(BaseService.APIUsers, "post").mockImplementation(() =>
  Promise.resolve()
);
vi.spyOn(BaseService.APIUsers, "patch").mockImplementation(() =>
  Promise.resolve()
);
vi.spyOn(BaseService.APIUsers, "delete").mockImplementation(() =>
  Promise.resolve()
);

vi.spyOn(LoaderFunctions, "getToken").mockReturnValue("mocked_token");
vi.spyOn(PermissionUtils, "checkAction").mockReturnValue(true);

describe("PermissionCRUD Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  test("deve renderizar o título corretamente", () => {
    render(<PermissionCRUD />);
    const title = screen.getByText(/Permission Management/i);
    expect(title).toBeInTheDocument();
  });

  test("deve chamar fetchPermissions ao carregar o componente", async () => {
    render(<PermissionCRUD />);
    await waitFor(() =>
      expect(BaseService.APIUsers.get).toHaveBeenCalledTimes(1)
    );
  });

  test("deve permitir a criação de permissões se o usuário tiver permissão", async () => {
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
      expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    });
  });
});
