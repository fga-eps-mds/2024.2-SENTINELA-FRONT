import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateSupplier from "./index";
import "@testing-library/jest-dom";

// Mock da função checkAction e usePermissions
vi.mock("../../../../Utils/permission", () => {
  return {
    ...vi.importActual("../../../../Utils/permission"),
    checkAction: vi.fn(
      (permissions, action) => action === "update" || action === "delete"
    ),
    usePermissions: () => ({}),
  };
});

// Mock das validações
vi.mock("../../../../Utils/validators", () => {
  return {
    isValidEmail: (email) =>
      !email || email === "valid@email.com"
        ? { isValid: true }
        : { isValid: false, message: "O e-mail fornecido não é válido." },
    isValidCelular: (celular) =>
      !celular || celular === "(61) 91234-1234"
        ? { isValid: true }
        : { isValid: false, message: "O celular fornecido não é válido." },
    isValidTelefone: (telefone) =>
      !telefone || telefone === "(61) 991234-1234"
        ? { isValid: true }
        : { isValid: false, message: "O telefone fornecido não é válido." },
    isValidCPForCNPJ: (cpfCNPJ) =>
      !cpfCNPJ || cpfCNPJ === "123.456.789-10"
        ? { isValid: true }
        : { isValid: false, message: "O CPF/CNPJ fornecido não é válido." },
  };
});

describe("SupplierUpdate", () => {
  beforeEach(() => {
    vi.mock("../../../../Services/supplierService", () => {
      return {
        updateSupplierFormById: vi.fn(),
        deleteSupplierFormById: vi.fn(),
        getSupplierFormById: vi.fn().mockResolvedValue({
          nome: "nome teste",
        }),
      };
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    render(
      <Router>
        <UpdateSupplier />
      </Router>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Visualização de fornecedor")
      ).toBeInTheDocument();
    });

    expect(screen).toMatchSnapshot();
  });
});
