import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CheckField from "./index";

describe("CheckField Component", () => {
  it("should render the component with the correct label", () => {
    render(<CheckField label="Test Label" />);

    const labelElement = screen.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();
  });

  it("should render as checked when 'checked' prop is true", () => {
    render(<CheckField label="Test Label" checked={true} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should render as unchecked when 'checked' prop is false", () => {
    render(<CheckField label="Test Label" checked={false} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should toggle the checkbox when clicked", () => {
    render(<CheckField label="Test Label" checked={false} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it("should call the 'onChange' function when clicked", () => {
    const onChangeMock = vi.fn();
    render(<CheckField label="Test Label" onChange={onChangeMock} />);

    const checkboxContainer = screen.getByText("Test Label");

    fireEvent.click(checkboxContainer);

    expect(onChangeMock).toHaveBeenCalledWith(true);

    fireEvent.click(checkboxContainer);

    expect(onChangeMock).toHaveBeenCalledWith(false);
  });

  it("should update the state when 'checked' prop changes", () => {
    const { rerender } = render(<CheckField label="Test Label" checked={false} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<CheckField label="Test Label" checked={true} />);
    expect(checkbox).toBeChecked();
  });
});
