import { render, screen, fireEvent,  waitFor} from "@testing-library/react";
import CloseModal from "../../Components/CloseModal"; 
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom';

describe("CloseModal Component", () => {
  it("deve renderizar corretamente", () => {
    render(<CloseModal />);
    expect(screen.getByText("Mensalidade Cancelada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("deve manter o modal aberto após clicar no botão OK", () => {
    render(<CloseModal />);
    const botaoFechar = screen.getByRole("button", { name: "OK" });

    fireEvent.click(botaoFechar);
    expect(screen.getByText("Mensalidade Cancelada")).toBeInTheDocument();
  });
});
