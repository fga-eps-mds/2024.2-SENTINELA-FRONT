import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import LoginNovo from "./index"; // Substituído Login por LoginNovo
import { BrowserRouter } from "react-router-dom";
import { getBenefitsForm } from "../../../Services/benefitsService";

vi.mock("../../../Services/benefitsService");

describe("LoginNovo", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render header sentinela image", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    expect(screen.getByAltText("Logo Sentinela")).toBeInTheDocument();
  });

  it("should render header vantagens and filiar buttons", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    expect(screen.getByText("Vantagens")).toBeInTheDocument();
    expect(screen.getByText("Filiar")).toBeInTheDocument();
  });

  it("should render body vantagens and filiar buttons", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    expect(screen.getByText("Filiar-me ao sindicato")).toBeInTheDocument();
    expect(screen.getByText("Ver vantagens")).toBeInTheDocument();
  });

  it("should render email and password input fields", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
  });

  it("should render login button and it should be enabled", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    const loginButton = screen.getByText("Entrar");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeEnabled();
  });

  it("should render forgot password button", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    const forgotPasswordButton = screen.getByText("Esqueci a senha");
    expect(forgotPasswordButton).toBeInTheDocument();
  });

  it("should render quero filiar and voltar ao topo buttons", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    expect(screen.getByText("Quero filiar")).toBeInTheDocument();
    expect(screen.getByText("Voltar ao Topo")).toBeInTheDocument();
  });

  it("fetches and displays benefits", async () => {
    const benefits = [
      { _id: "1", nome: "Benefício 1", descricao: "descrição beneficio 1" },
      { _id: "2", nome: "Benefício 2", descricao: "descrição beneficio 2" },
    ];
    getBenefitsForm.mockResolvedValue(benefits);

    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Benefício 1")).toBeInTheDocument();
    expect(screen.getByText("Benefício 2")).toBeInTheDocument();

    const detailButtons = screen.getAllByText("Saber mais");
    expect(detailButtons).toHaveLength(benefits.length);
  });

  it("should update email field", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    const emailField = screen.getByPlaceholderText("Digite seu email");

    fireEvent.change(emailField, { target: { value: "test@example.com" } });

    expect(emailField.value).toBe("test@example.com");
  });

  it("should update password field", () => {
    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    const passwordField = screen.getByPlaceholderText("Digite sua senha");

    fireEvent.change(passwordField, { target: { value: "password123" } });

    expect(passwordField.value).toBe("password123");
  });

  it("modal should be visible after clicking saber mais", async () => {
    const benefits = [
      { _id: "1", nome: "Benefício 1", descricao: "descrição beneficio 1" },
      { _id: "2", nome: "Benefício 2", descricao: "descrição beneficio 2" },
    ];
    getBenefitsForm.mockResolvedValue(benefits);

    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      const detailButtons = screen.getAllByText("Saber mais");
      fireEvent.click(detailButtons[0]);
    });

    expect(screen.getByText("descrição beneficio 1")).toBeVisible();
  });

  it("modal should not be visible after clicking on the x", async () => {
    const benefits = [
      { _id: "1", nome: "Benefício 1", descricao: "descrição beneficio 1" },
      { _id: "2", nome: "Benefício 2", descricao: "descrição beneficio 2" },
    ];
    getBenefitsForm.mockResolvedValue(benefits);

    render(
      <BrowserRouter>
        <LoginNovo />
      </BrowserRouter>
    );

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      const detailButtons = screen.getAllByText("Saber mais");
      fireEvent.click(detailButtons[0]);
    });

    expect(screen.getByText("descrição beneficio 1")).toBeVisible();

    await waitFor(() => {
      const xButton = screen.getByText("x");
      fireEvent.click(xButton);
    });

    expect(screen.queryByText("descrição beneficio 1")).toBeNull();
  });
});
