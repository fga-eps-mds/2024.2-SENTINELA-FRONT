import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PayedModal from "../PayedModal"; 
import "@testing-library/jest-dom";

describe("PayedModal", () => {
    it("deve renderizar a mensagem corretamente", () => {
      render(<PayedModal onClose={vi.fn()} />); 
      expect(screen.getByText("Mensalidade Quitada")).toBeInTheDocument();
    });
  
    it("deve chamar a função onClose quando o botão 'OK' for clicado", () => {
      const onCloseMock = vi.fn();
  
      render(<PayedModal onClose={onCloseMock} />);
  
      fireEvent.click(screen.getByText("OK"));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });