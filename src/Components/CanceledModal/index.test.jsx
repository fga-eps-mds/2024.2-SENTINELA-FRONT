import { render, screen, fireEvent } from "@testing-library/react";
import CanceledModal from "../../Components/CanceledModal";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';

describe("CanceledModal Component", () => {
    let mockOnClose;
  
    beforeEach(() => {
      mockOnClose = vi.fn();
    });

  it("deve renderizar corretamente o texto e o botão", () => {
    render(<CanceledModal onClose={mockOnClose} />);


    expect(screen.getByText("Mensalidade Cancelada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("deve chamar onClose quando o botão 'OK' for clicado", () => {
    render(<CanceledModal onClose={mockOnClose} />);


    fireEvent.click(screen.getByRole("button", { name: "OK" }));


    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("não deve chamar onClose antes do clique", () => {
    render(<CanceledModal onClose={mockOnClose} />);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
