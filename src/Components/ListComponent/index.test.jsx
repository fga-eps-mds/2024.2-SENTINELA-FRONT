import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ListComponent from "../ListComponent";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../Styles/global"; 
import '@testing-library/jest-dom';

describe("ListComponent", () => {
  it("deve renderizar o label corretamente", () => {
    render(
      <ThemeProvider theme={theme}>
        <ListComponent label="Minha Lista" onClick={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText("Minha Lista")).toBeInTheDocument();
  });

  it("deve chamar a função onClick quando o item da lista for clicado", () => {
    const onClickMock = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <ListComponent label="Minha Lista" onClick={onClickMock} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Minha Lista"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("deve ter a classe de estilo correta", () => {
    render(
      <ThemeProvider theme={theme}>
        <ListComponent label="Minha Lista" onClick={vi.fn()} />
      </ThemeProvider>
    );

    const listComponent = screen.getByText("Minha Lista").closest("div");
    const backgroundColor = getComputedStyle(listComponent).backgroundColor;
    expect(backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });
});