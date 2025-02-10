import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock para o hook useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

function mockServices() {
  vi.mock("../../../../Services/patrimonioService", () => ({
    patrimonioCreate: vi.fn(),
  }));
}

describe("patrimonioCreate Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockServices();
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));

    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate); // Configurando o mock do useNavigate

    render(
      <Router>
        <patrimonioCreate />
      </Router>
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("render patrimonioCreate page correctly", () => {
    expect(screen).toMatchSnapshot();
  });
});
/*
it("should validate mandatory fields before submitting", async () => {
  await fillUpRequiredFields();

  // Submetendo após preencher todos os campos obrigatórios
  //await userEvent.click(screen.getByText("Cadastrar"));
  await waitFor(() =>
    expect(screen.getByText("Cadastrar")).toBeInTheDocument()
  );
  userEvent.click(screen.getByText("Cadastrar"));

  await waitFor(() => {
    expect(patrimonioCreate).toHaveBeenCalledTimes(1);
  });

  it("should alert if mandatory fields are not filled", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Tentando submeter sem preencher os campos obrigatórios
    await userEvent.click(screen.getByText("Cadastrar"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Preencha todos os campos obrigatórios!"
      );
    });
  });
  
});*/
