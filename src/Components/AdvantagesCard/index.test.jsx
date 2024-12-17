import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdvantagesCard from "./index";

describe("AdvantagesCard", () => {
  it("should render the title correctly", () => {
    const mockTitle = "Benefícios exclusivos";

    render(<AdvantagesCard title={mockTitle} onClick={() => {}} />);

    const titleElement = screen.getByText(mockTitle);
    expect(titleElement).toBeInTheDocument();
  });

  it("should call onClick when 'Saber mais' is clicked", () => {
    const mockOnClick = vi.fn();
    const mockTitle = "Benefícios exclusivos";

    render(<AdvantagesCard title={mockTitle} onClick={mockOnClick} />);

    const linkElement = screen.getByText("Saber mais");
    fireEvent.click(linkElement);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should render without crashing when no props are provided", () => {
    render(<AdvantagesCard />);
    const linkElement = screen.getByText("Saber mais");

    expect(linkElement).toBeInTheDocument();
  });
});
