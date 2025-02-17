import { render, screen, fireEvent } from "@testing-library/react";
import CancelInformationModal from "../../Components/CancelInformationModal"; 
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';

describe("CancelInformationModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const mockSetCancelDate = vi.fn();
  const mockSetJustification = vi.fn();



  it("deve chamar onClose quando o botão 'VOLTAR' for clicado", () => {
    render(
      <CancelInformationModal
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        cancelDate=""
        setCancelDate={mockSetCancelDate}
        justification=""
        setJustification={mockSetJustification}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "VOLTAR" }));

    // Verifica se a função onClose foi chamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onConfirm quando o botão 'DESFILIAR' for clicado", () => {
    render(
      <CancelInformationModal
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        cancelDate=""
        setCancelDate={mockSetCancelDate}
        justification=""
        setJustification={mockSetJustification}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "DESFILIAR" }));

    // Verifica se a função onConfirm foi chamada
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("deve atualizar o valor de justification quando o textarea for alterado", () => {
    render(
      <CancelInformationModal
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        cancelDate=""
        setCancelDate={mockSetCancelDate}
        justification=""
        setJustification={mockSetJustification}
      />
    );

    const textarea = screen.getByPlaceholderText("Justificativa...");
    fireEvent.change(textarea, { target: { value: "Motivo do cancelamento" } });

    // Verifica se a função setJustification foi chamada com o valor correto
    expect(mockSetJustification).toHaveBeenCalledWith("Motivo do cancelamento");
  });
});
