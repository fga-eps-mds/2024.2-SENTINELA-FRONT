import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SideButton from "./index";

describe("SideButton Component", () => {
  it("should render the button with the correct text", () => {
    render(<SideButton text="Test Button" onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toBeInTheDocument();
  });

  it("should call the 'onClick' function when the button is clicked", () => {
    const onClickMock = vi.fn();
    render(<SideButton text="Click Me" onClick={onClickMock} />);

    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should hide the button when 'hidden' prop is set to 'none'", () => {
    render(<SideButton text="Hidden Button" hidden="none" onClick={() => {}} />);

    const button = screen.queryByRole("button", { name: "Hidden Button" });
    expect(button).not.toBeInTheDocument();
  });

  it("should show the button when 'hidden' prop is set to 'flex'", () => {
    render(<SideButton text="Visible Button" hidden="flex" onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Visible Button" });
    expect(button).toBeInTheDocument();
  });
});
