import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CheckList from "./index";

vi.mock("../BigModal", () => ({
  __esModule: true,
  default: ({ show, handleClose, children }) => (
    <div data-testid="big-modal" style={{ display: show ? "block" : "none" }}>
      <button onClick={handleClose}>Close</button>
      {children}
    </div>
  ),
}));

describe("CheckList Component", () => {
  const mockOnChange = vi.fn();
  const items = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      religion: "Christian",
      phone: "123456789",
      cpf: "123.456.789-00",
      birthDate: "1990-01-01",
      sex: "Male",
      address: "123 Main St",
      naturalness: "City A",
      uf_naturalidade: "SP",
      marialStatus: "Single",
      education: "Bachelor",
      lotacao: "Office",
      position: "Manager",
      shipperOrganization: "Org A",
      hiringDate: "2022-01-01",
      dependents: [1, 2],
    },
    {
      _id: "2",
      name: "Jane Doe",
      email: "jane@example.com",
      religion: "Catholic",
      phone: "987654321",
      cpf: "987.654.321-00",
      birthDate: "1995-05-15",
      sex: "Female",
      address: "456 Elm St",
      naturalness: "City B",
      uf_naturalidade: "RJ",
      marialStatus: "Married",
      education: "Master",
      lotacao: "HQ",
      position: "Director",
      shipperOrganization: "Org B",
      hiringDate: "2023-06-01",
      dependents: [],
    },
  ];

  const selectedValues = ["1"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the list of items correctly", () => {
    render(<CheckList items={items} value={selectedValues} onChange={mockOnChange} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should call onChange with updated values when a checkbox is clicked", () => {
    render(<CheckList items={items} value={selectedValues} onChange={mockOnChange} />);

    const secondCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(secondCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(["1", "2"]);
  });

  it("should open the modal and display user details when an item is clicked", async () => {
    render(<CheckList items={items} value={selectedValues} onChange={mockOnChange} />);
  
    fireEvent.click(screen.getByText("John Doe"));
  
    const modal = screen.getByTestId("big-modal");
    expect(modal).toBeVisible();
  
    const modalContent = within(modal);
  
    expect(modalContent.getByText("Nome:")).toBeInTheDocument();
    expect(modalContent.getByText("John Doe")).toBeInTheDocument();
    expect(modalContent.getByText("Email:")).toBeInTheDocument();
    expect(modalContent.getByText("john@example.com")).toBeInTheDocument();
    expect(modalContent.getByText("Religião:")).toBeInTheDocument();
    expect(modalContent.getByText("Christian")).toBeInTheDocument();
    expect(modalContent.getByText("Dependentes:")).toBeInTheDocument();
    expect(modalContent.getByText("2")).toBeInTheDocument();
  });  

  it("should close the modal when the close button is clicked", async () => {
    render(<CheckList items={items} value={selectedValues} onChange={mockOnChange} />);

    fireEvent.click(screen.getByText("John Doe"));
    const modal = screen.getByTestId("big-modal");
    expect(modal).toBeVisible();

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(modal).not.toBeVisible();
    });
  });
});
