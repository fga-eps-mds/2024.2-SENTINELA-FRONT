import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "./index";
import { describe, it, expect } from "vitest";

describe("Footer Component", () => {
  it("should render the Sindpol logo", () => {
    render(<Footer />);

    const logo = screen.getByAltText("Sindpol Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/src/assets/sindpol-logo.png");
  });

  it("should render the copyright text", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        "Copyright © 2024 • Sindpol-DF • CNPJ 11.236.674/0001-06"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Setor de Diversões Sul (SDS), Conjunto Baracat Bloco F 27, Salas 313/315 • Asa Sul"
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Brasília/DF • CEP 70392-900")).toBeInTheDocument();
  });

  it("should render all social media links with correct URLs", () => {
    render(<Footer />);

    const expectedLinks = [
      "https://www.facebook.com/sindpoldf",
      "https://x.com/sindpoldf",
      "https://www.youtube.com/@sindpoldf/videos",
      "https://api.whatsapp.com/send/?phone=556133211949",
      "https://www.instagram.com/sindpoldf/",
    ];

    const links = screen.getAllByRole("link");

    expectedLinks.forEach((expectedHref) => {
      const link = links.find(
        (link) => link.getAttribute("href") === expectedHref
      );
      expect(link).toBeInTheDocument();
    });

    expect(links).toHaveLength(5);
  });
});
