import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateSupplier from "./index";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
  deleteSupplierFormById,
  updateSupplierFormById,
} from "../../../../Services/supplierService";

// Mock da função checkAction e usePermissions
vi.mock("../../../../Utils/permission", () => {
  return {
    ...vi.importActual("../../../../Utils/permission"), // Importa o módulo real
    checkAction: vi.fn((permissions, action) => {
      if (
        module === "finance" &&
        (action === "update" || action === "delete")
      ) {
        return true;
      }
      return false;
    }),
    usePermissions: () => ({}),
  };
});

function mockValidators() {
  vi.mock("../../../../Utils/validators", () => {
    return {
      isValidEmail: (email) =>
        !email || email === "valid@email.com"
          ? { isValid: true }
          : {
              isValid: false,
              message: "O e-mail fornecido não é válido.",
            },
      isValidCelular: (celular) =>
        !celular || celular === "(61) 91234-1234"
          ? { isValid: true }
          : {
              isValid: false,
              message: "O celular fornecido não é válido.",
            },
      isValidTelefone: (telefone) =>
        !telefone || telefone === "(61) 991234-1234"
          ? { isValid: true }
          : {
              isValid: false,
              message: "O telefone fornecido não é válido.",
            },
      isValidCPForCNPJ: (cpfCNPJ) =>
        !cpfCNPJ || cpfCNPJ === "123.456.789-10"
          ? { isValid: true }
          : {
              isValid: false,
              message: "O cpf fornecido não é válido.",
            },
    };
  });
}

describe("SupplierUpdate", () => {
  beforeEach(() => {
    vi.mock("../../../../Services/supplierService", () => {
      return {
        updateSupplierFormById: vi.fn(),
        deleteSupplierFormById: vi.fn(),
        getSupplierFormById: () => ({
          nome: "nome teste",
        }),
      };
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <Router>
        <UpdateSupplier />
      </Router>
    );
    expect(screen).toMatchSnapshot();
  });

  it("validates form correctly before submitting", async () => {
    mockValidators();

    render(
      <Router>
        <UpdateSupplier />
      </Router>
    );

    await act(async () => {
      const emailInput = await screen.findByLabelText("E-mail");

      fireEvent.change(emailInput, {
        target: { value: "invalid-email" },
      });

      await userEvent.click(screen.getByText("Salvar"));

      expect(updateSupplierFormById).not.toHaveBeenCalled();

      fireEvent.change(emailInput, {
        target: { value: "valid@email.com" },
      });

      const celInput = await screen.findByLabelText("Celular");

      fireEvent.change(celInput, {
        target: { value: "123" },
      });

      await userEvent.click(screen.getByText("Salvar"));

      expect(updateSupplierFormById).not.toHaveBeenCalled();

      fireEvent.change(celInput, {
        target: { value: "(61) 91234-1234" },
      });

      const phoneInput = await screen.findByLabelText("Telefone");

      fireEvent.change(phoneInput, {
        target: { value: "123" },
      });

      await userEvent.click(screen.getByText("Salvar"));

      expect(updateSupplierFormById).not.toHaveBeenCalled();

      fireEvent.change(phoneInput, {
        target: { value: "(61) 991234-1234" },
      });

      const cpfCNPJInput = await screen.findByLabelText("CPF/CNPJ");

      fireEvent.change(cpfCNPJInput, {
        target: { value: "123" },
      });

      await userEvent.click(screen.getByText("Salvar"));

      expect(updateSupplierFormById).not.toHaveBeenCalled();

      fireEvent.change(cpfCNPJInput, {
        target: { value: "123.456.789-10" },
      });

      await userEvent.click(screen.getByText("Salvar"));

      await waitFor(() =>
        expect(updateSupplierFormById).toHaveBeenCalledTimes(1)
      );
    });
  });

  it("deletes supplier correctly", async () => {
    render(
      <Router>
        <UpdateSupplier />
      </Router>
    );

    await userEvent.click(screen.getByText("Deletar"));

    expect(
      screen.getByText("Deseja deletar o fornecedor do sistema?")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText("EXCLUIR FORNECEDOR"));

    await waitFor(() =>
      expect(deleteSupplierFormById).toHaveBeenCalledTimes(1)
    );
  });
});
