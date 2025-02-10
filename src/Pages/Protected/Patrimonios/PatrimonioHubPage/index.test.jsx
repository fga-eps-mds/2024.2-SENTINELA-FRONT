import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Patrimonio from "./index.jsx";
import "@testing-library/jest-dom";
import { useAuth } from "../../../../Context/auth";
import { checkAction } from "../../../../Utils/permission";

// Mock the hook useAuth and the checkAction function
vi.mock("../../../../Context/auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../../Utils/permission", () => ({
  checkAction: vi.fn(),
}));

describe("Patrimonio", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { name: "Test User" },
    });

    checkAction.mockImplementation((permission) => {
      const permissions = {
        patrimonio_criar: true,
        patrimonio_editar: true,
        patrimonio_deletar: true,
        patrimonio_visualizar: true,
      };
      return permissions[permission];
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <Router>
        <Patrimonio />
      </Router>
    );
    expect(screen.getByAltText("Sindpol Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Sentinela Logo")).toBeInTheDocument();
    expect(screen.getByText("Lista de Patrimônios")).toBeInTheDocument();
  });

  it("checks permissions before rendering the button", () => {
    // Mock with permissions that do not allow the button to be displayed
    checkAction.mockImplementation(() => false);

    render(
      <Router>
        <Patrimonio />
      </Router>
    );
    expect(screen.queryByText("Lista de Patrimônios")).toBeNull();
  });
});
