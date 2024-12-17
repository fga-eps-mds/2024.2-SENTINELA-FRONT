/* eslint-disable no-undef */
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Carteirinha from "./index";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


vi.mock("html2canvas", () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => "data:image/png;base64,mockImage",
    height: 600,
    width: 800,
  }),
}));

vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
  })),
}));

describe("Carteirinha Component", () => {
  const mockMembershipData = [
    {
      name: "John Doe",
      birthDate: "1990-01-01",
      cpf: "123.456.789-00",
      expeditionDate: "2023-08-01",
      hiringDate: "2022-06-15",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMembershipData),
      })
    );
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("should display 'Carregando dados...' while fetching data", () => {
    render(<Carteirinha />);
    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
  });

  it("should render membership data correctly", async () => {
    render(<Carteirinha />);
  
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("12/31/1989")).toBeInTheDocument(); // Data de nascimento
      expect(screen.getByText("7/31/2023")).toBeInTheDocument(); // Data de expedição
      expect(screen.getByText("6/14/2022")).toBeInTheDocument(); // Data de contratação
      expect(screen.getByText("123.456.789-00")).toBeInTheDocument(); // CPF
    });
  });  

  it("should call downloadPDF when clicking on 'BAIXAR CARTEIRINHA' button", async () => {
    const mockSave = vi.fn();
    jsPDF.mockImplementation(() => ({
      addImage: vi.fn(),
      save: mockSave,
    }));

    render(<Carteirinha />);

    await waitFor(() => {
      expect(screen.getByText("BAIXAR CARTEIRINHA")).toBeInTheDocument();
    });

    const button = screen.getByText("BAIXAR CARTEIRINHA");
    fireEvent.click(button);

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalledWith("carteirinha.pdf");
    });
  });

  it("should log an error if fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.reject(new Error("Fetch error")));

    render(<Carteirinha />);

    await waitFor(() => {
      expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Erro ao buscar os dados do membership:",
        expect.any(Error)
      );
    });

    console.error.mockRestore();
  });
});
