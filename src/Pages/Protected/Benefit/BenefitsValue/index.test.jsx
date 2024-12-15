import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import BenefitsValue from "./index";
import { getBenefitsForm } from "../../../../Services/benefitsService";

import "@testing-library/jest-dom";

vi.mock("../../../../Services/benefitsService");
vi.mock("../../../../Utils/permission", () => ({
  usePermissions: () => ({
    somePermission: true,
  }),
  checkAction: () => true,
}));

describe("BenefitsValue", () => {
  beforeEach(() => {
    localStorage.setItem("@App:user", JSON.stringify({ token: "mock-token" }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly", async () => {
    getBenefitsForm.mockResolvedValue([]);

    render(
      <Router>
        <BenefitsValue />
      </Router>
    );

    expect(screen.getByText("Valores dos benefícios")).toBeInTheDocument();
    expect(screen.getByText("Benefícios disponíveis")).toBeInTheDocument();

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
  });

  it("fetches and displays benefits", async () => {
    const benefits = [
      { _id: "1", nome: "Benefício 1", descricao: "descrição beneficio 1" },
      { _id: "2", nome: "Benefício 2", descricao: "descrição beneficio 2" },
    ];
    getBenefitsForm.mockResolvedValue(benefits);

    render(
      <Router>
        <BenefitsValue />
      </Router>
    );

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Benefício 1")).toBeInTheDocument();
    expect(screen.getByText("Benefício 2")).toBeInTheDocument();

    const detailButtons = screen.getAllByText("Mais Detalhes");
    expect(detailButtons).toHaveLength(benefits.length);

    const valorText = screen.getAllByText("Valor");
    expect(valorText).toHaveLength(benefits.length);

    expect(screen.getByText("Incluso na filiação")).toBeInTheDocument();
    expect(screen.getByText("Disconto de 15%")).toBeInTheDocument();
  });

  it("exibits benefit details on Mais detalhes click", async () => {
    const benefits = [
      { _id: "1", nome: "Benefício 1", descricao: "descrição beneficio 1" },
      { _id: "2", nome: "Benefício 2", descricao: "descrição beneficio 2" },
    ];
    getBenefitsForm.mockResolvedValue(benefits);

    render(
      <Router>
        <BenefitsValue />
      </Router>
    );

    await waitFor(() => expect(getBenefitsForm).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      const detailButtons = screen.getAllByText("Mais Detalhes");
      fireEvent.click(detailButtons[0]);
    });

    expect(screen.getByText("descrição beneficio 1")).toBeInTheDocument();

    await waitFor(() => {
      const detailButtons = screen.getAllByText("Mais Detalhes");
      fireEvent.click(detailButtons[1]);
    });

    expect(screen.getByText("descrição beneficio 2")).toBeInTheDocument();
  });
});
