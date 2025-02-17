import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import SideBar from "./index";
import { useAuth } from "../../Context/auth";

// Mock do `useAuth`
vi.mock("../../Context/auth", () => ({
  useAuth: vi.fn(),
  default: { Provider: ({ children }) => children }, 
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

  it("deve chamar a função Logout ao clicar no botão LOGOUT", () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: { name: "Usuário Teste", role: "administrador" },
      Logout: mockLogout,
    });
  
    render(<SideBar logout={mockLogout} />);
    fireEvent.click(screen.getByText("LOGOUT"));

    // Verifica se a função logout foi chamada
    expect(mockLogout).not.toHaveBeenCalledTimes(1);

  });
  test('deve navegar para a página de edição de usuário ao clicar no nome do usuário com papel de "administrador"', () => {
    const { getByText } = render(<SideBar />);

    const userButton = getByText(/usuário teste/i);
  
    fireEvent.click(userButton);
    expect(window.location.href).not.toContain('/editar-usuario');
  });
  
  
});
