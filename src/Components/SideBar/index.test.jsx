import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import SideBar from "./index";
import { useAuth } from "../../Context/auth";

// Mock do `useAuth`
vi.mock("../../Context/auth", () => ({
  useAuth: vi.fn(),
  default: { Provider: ({ children }) => children }, // Mock do contexto
}));

// Mock do `usePermissions`
vi.mock("../../Utils/permission", () => ({
  usePermissions: vi.fn().mockReturnValue({}),
  checkAction: vi.fn().mockReturnValue(true),
}));

// Mock do `react-router-dom`
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("SideBar Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuth).mockReturnValue({
      user: {
        name: "Usuário Teste",
        role: "administrador",
      },
    });
  });

  it("deve renderizar corretamente", () => {
    render(
      <MemoryRouter>
        <SideBar />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Sindpol Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Sentinela Logo")).toBeInTheDocument();
    expect(screen.getByText("PÁGINA INICIAL")).toBeInTheDocument();
  });

  it("deve navegar para 'home' ao clicar no botão 'PÁGINA INICIAL'", () => {
    render(
      <MemoryRouter>
        <SideBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("PÁGINA INICIAL"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("deve exibir o nome do usuário logado", () => {
    render(
      <MemoryRouter>
        <SideBar />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Você está logado como Usuário Teste")
    ).toBeInTheDocument();
  });
});
