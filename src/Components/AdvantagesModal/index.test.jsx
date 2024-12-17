import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdvantagesModal from "./index";

describe("AdvantagesModal", () => {
  const mockTitle = "Vantagens do Sindicato";
  const mockDescription = "Este é o detalhamento das vantagens oferecidas.";
  const mockOnClose = vi.fn();

  it("should render the title correctly", () => {
    render(
      <AdvantagesModal
        title={mockTitle}
        description={mockDescription}
        onClose={mockOnClose}
      />
    );

    const titleElement = screen.getByText(mockTitle);
    expect(titleElement).toBeInTheDocument();
  });

  it("should render the description correctly", () => {
    render(
      <AdvantagesModal
        title={mockTitle}
        description={mockDescription}
        onClose={mockOnClose}
      />
    );

    const descriptionElement = screen.getByText(mockDescription);
    expect(descriptionElement).toBeInTheDocument();
  });

  it("should call onClose when the close button is clicked", () => {
    render(
      <AdvantagesModal
        title={mockTitle}
        description={mockDescription}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText("x");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should render the contact information", () => {
    render(
      <AdvantagesModal
        title={mockTitle}
        description={mockDescription}
        onClose={mockOnClose}
      />
    );
  
    const contactInfo = screen.getByText((content) =>
      content.includes("Para mais informações, entre em contato com o Sindicato pelo número")
    );
  
    const phoneNumber = screen.getByText("(61) 3321-1949");
  
    expect(contactInfo).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
  });
  
});
