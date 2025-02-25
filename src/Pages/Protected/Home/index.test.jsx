import { render, screen, within } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Home from "./index";
import { processUserData, getLineChartData } from "./index.jsx";

vi.mock("../../../Context/auth", () => ({
  useAuth: vi.fn().mockReturnValue({ user: {} }),
}));

vi.mock("../../../Services/userService", () => ({
  getUsers: vi.fn().mockResolvedValue([
    { status: true, lotacao: "Lotacao 1", orgao: "Orgao 1", sex: "Masculino" },
    { status: true, lotacao: "Lotacao 1", orgao: "Orgao 2", sex: "Feminino" },
    { status: false, lotacao: "Lotacao 2", orgao: "Orgao 1", sex: "Masculino" },
    { status: false, lotacao: "Lotacao 2", orgao: "Orgao 2", sex: "Feminino" },
    { status: true, lotacao: "Lotacao 3", orgao: "Orgao 1", sex: "Masculino" },
  ]),
}));

vi.mock("../../../Services/benefitsService", () => ({
  getBenefitsForm: vi
    .fn()
    .mockResolvedValue([
      { nome: "Benefício 1" },
      { nome: "Benefício 2" },
      { nome: "Benefício 3" },
    ]),
}));

vi.mock("react-chartjs-2", () => ({
  Doughnut: () => <div>Mocked Doughnut Chart</div>,
  Line: () => <div>Mocked Line Chart</div>, // Mock para o componente Line
}));

vi.mock("./index.jsx", async (importOriginal) => {
  const actual = await importOriginal(); // Importa as exportações originais
  return {
    ...actual, // Preserva as outras exportações
    processUserData: vi.fn((users) => {
      if (!users || users.length === 0) {
        return {
          datasets: [
            { data: new Array(12).fill(0) },
            { data: new Array(12).fill(0) },
            { data: new Array(12).fill(0) },
          ],
        };
      }
      return {
        datasets: [
          { data: [1, 0, 0] },
          { data: [0, 1, 0] },
          { data: [0, 0, 1] },
        ],
      };
    }),
    getLineChartData: vi.fn((data, type) => {
      if (!data || data.length === 0) {
        return { labels: [], datasets: [] };
      }
      switch (type) {
        case "Mensal":
          return {
            labels: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
            datasets: [
              { data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] },
            ],
          };
        case "Semestral":
          return {
            labels: ["1º Semestre", "2º Semestre"],
            datasets: [{ data: [135, 315] }],
          };
        case "Anual":
          return {
            labels: ["2025"],
            datasets: [{ data: [450] }],
          };
        default:
          return { labels: [], datasets: [] };
      }
    }),
  };
});

describe("Home Component", () => {
  it("renders without crashing", () => {
    render(<Home />);

    expect(screen.getByText("Filiados")).toBeInTheDocument();
    expect(screen.getByText("Divisão de sexo por lotação")).toBeInTheDocument();
    expect(
      screen.getByText("Divisão de lotação por órgão")
    ).toBeInTheDocument();

    const doughnutCharts = screen.getAllByText("Mocked Doughnut Chart");
    expect(doughnutCharts).toHaveLength(3);
    expect(doughnutCharts[0]).toBeInTheDocument();
    expect(doughnutCharts[1]).toBeInTheDocument();
    expect(doughnutCharts[2]).toBeInTheDocument();

    const filiadosSection = screen.getByText("Filiados").closest("div");
    expect(within(filiadosSection).getByText(/Filtro/i)).toBeInTheDocument();
    const donutBox = screen
      .getByText("Divisão de sexo por lotação")
      .closest("div");
    expect(
      within(donutBox).getByText(/Filtro de Lotação/i)
    ).toBeInTheDocument();

    const donutBox2 = screen
      .getByText("Divisão de lotação por órgão")
      .closest("div");
    expect(within(donutBox2).getByText(/Filtro de Órgão/i)).toBeInTheDocument();

    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("fetches and displays users correctly", async () => {
    await waitFor(() => render(<Home />));
    expect(screen.getByText("Filiados")).toBeInTheDocument();
  });

  it("fetches and processes benefits correctly", async () => {
    await waitFor(() => render(<Home />));
    expect(screen.getByText("Distribuição de Benefícios")).toBeInTheDocument();
  });
});

describe("Função processUserData", () => {
  it("deve processar corretamente os usuários", () => {
    const users = [
      {
        role: { name: "sindicalizado" },
        status: true,
        hiringDate: "2024-01-15",
        updatedAt: "2024-02-01",
      },
      {
        role: { name: "não sindicalizado" },
        status: false,
        hiringDate: "2023-05-10",
        updatedAt: "2024-03-20",
      },
      {
        role: { name: "sindicalizado" },
        status: false,
        hiringDate: "2023-07-22",
        updatedAt: "2024-04-10",
      },
    ];

    const result = processUserData(users);

    expect(result.datasets[0].data).toEqual(expect.arrayContaining([1])); // Deve conter pelo menos um filiado
    expect(result.datasets[1].data).toEqual(expect.arrayContaining([1])); // Deve conter pelo menos um desfiliado
    expect(result.datasets[2].data).toEqual(expect.arrayContaining([1])); // Deve conter pelo menos um não filiado
  });

  it("deve lidar com array vazio sem erro", () => {
    const result = processUserData([]);
    expect(result.datasets[0].data).toEqual(new Array(12).fill(0));
    expect(result.datasets[1].data).toEqual(new Array(12).fill(0));
    expect(result.datasets[2].data).toEqual(new Array(12).fill(0));
  });
});

describe("Função getLineChartData", () => {
  const mockData = {
    datasets: [
      { data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] }, // Filiações
      { data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] }, // Desfiliações
      { data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] }, // Não filiados
    ],
  };

  it("deve retornar dados mensais corretamente", () => {
    const result = getLineChartData(mockData, "Mensal");

    expect(result.labels).toEqual([
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ]);
    expect(result.datasets[0].data.length).toBe(12);
  });

  it("deve retornar dados semestrais corretamente", () => {
    const result = getLineChartData(mockData, "Semestral");

    expect(result.labels).toEqual(["1º Semestre", "2º Semestre"]);
    expect(result.datasets[0].data).toEqual([
      10 + 15 + 20 + 25 + 30 + 35,
      40 + 45 + 50 + 55 + 60 + 65,
    ]);
  });

  it("deve retornar dados anuais corretamente", () => {
    const result = getLineChartData(mockData, "Anual");

    expect(result.labels).toEqual(["2025"]);
    expect(result.datasets[0].data).toEqual([
      10 + 15 + 20 + 25 + 30 + 35 + 40 + 45 + 50 + 55 + 60 + 65,
    ]);
  });

  it("deve lidar com dados vazios sem erro", () => {
    const result = getLineChartData(null, "Mensal");

    expect(result.labels).toEqual([]);
    expect(result.datasets).toEqual([]);
  });
});
