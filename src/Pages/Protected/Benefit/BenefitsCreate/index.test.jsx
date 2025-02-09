/* eslint-disable no-unused-vars */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import BenefitsCreate from "./index";
import { createBenefitsForm } from "../../../../Services/benefitsService";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

async function fillUpRequiredFields() {
  const selects = screen.getAllByRole("combobox");
  const statusSelect = selects.find((s) => s.id === "select-Status *");
  const irSelect = selects.find((s) => s.id === "select-Considerado no IR *");
  const descontoSelect = selects.find(
    (s) => s.id === "select-Desconto automático *"
  );

  await userEvent.click(statusSelect);
  await userEvent.click(screen.getByRole("option", { name: "Ativo" }));

  await userEvent.click(irSelect);
  await userEvent.click(screen.getByRole("option", { name: "Sim" }));

  await userEvent.click(descontoSelect);
  await userEvent.click(screen.getByRole("option", { name: "Sim" }));

  const nomeInput = await screen.findByLabelText("Nome fantasia *");
  const razaoInput = await screen.findByLabelText("Razão social *");

  await fireEvent.change(nomeInput, {
    target: { value: "Test Benefit" },
  });

  await fireEvent.change(razaoInput, {
    target: { value: "Test Razão Social" },
  });
}

function mockValidators() {
  // mocka funções de validação do service
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
              message: "O telefone fornecido não é válido.",
            },
      isValidSite: (site) =>
        !site || site === "https://valid.com"
          ? { isValid: true }
          : {
              isValid: false,
              message: "O site fornecido não é válido.",
            },
    };
  });
}

describe("BenefitsCreate", () => {
  beforeEach(() => {
    // mocka o arquivo de services, hoje isso é utilizado apenas
    // para um caso de teste, porém pode ser útil no futuro que esteja no before each
    vi.mock("../../../../Services/benefitsService");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(
      <Router>
        <BenefitsCreate />
      </Router>
    );

    expect(screen).toMatchSnapshot();
  });
});
