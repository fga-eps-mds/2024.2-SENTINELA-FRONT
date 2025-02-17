import { render, screen, fireEvent, act } from "@testing-library/react";
import FieldFile from "../../Components/FieldFile"; 
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("FieldFile Component", () => {
  const mockOnChange = vi.fn();

  it("deve renderizar corretamente o campo com o label", () => {
    render(<FieldFile label="Upload File" onChange={mockOnChange} />);

    // Verifica se o label é renderizado corretamente
    expect(screen.getByLabelText("Upload File")).toBeInTheDocument();

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("deve exibir o nome do arquivo e a pré-visualização após o upload de um arquivo", async () => {
    const file = new File(["file content"], "example.jpg", { type: "image/jpeg" });
    render(<FieldFile label="Upload File" onChange={mockOnChange} />);

    const inputFile = screen.getByLabelText("Upload File").nextElementSibling.querySelector("input");
    
    // Simula a mudança do arquivo
    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    // Verifica se o nome do arquivo foi exibido
    expect(screen.getByDisplayValue("example.jpg")).toBeInTheDocument();

    await screen.findByAltText("Preview");
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  it("deve chamar onChange com o arquivo correto quando o arquivo for alterado", async () => {
    const file = new File(["file content"], "example.jpg", { type: "image/jpeg" });
    render(<FieldFile label="Upload File" onChange={mockOnChange} />);

    const inputFile = screen.getByLabelText("Upload File").nextElementSibling.querySelector("input");
    
    // Simula a mudança do arquivo
    await act(async () => {
      fireEvent.change(inputFile, { target: { files: [file] } });
    });

    // Verifica se a função onChange foi chamada com o arquivo correto
    expect(mockOnChange).toHaveBeenCalledWith(file);
  });

  

  it("deve exibir a pré-visualização da imagem se o valor for uma URL de imagem", () => {
    const imageUrl = "https://example.com/image.jpg";
    render(<FieldFile label="Upload File" onChange={mockOnChange} value={imageUrl} />);

    // Verifica se a imagem de pré-visualização está sendo renderizada
    expect(screen.getByAltText("Preview")).toHaveAttribute("src", imageUrl);
  });
});
