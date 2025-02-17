import { render, screen, fireEvent } from "@testing-library/react";
import BasicDateField from "../../Components/DateField"; 
import { describe, it, expect, vi } from "vitest";
import dayjs from "dayjs";
import "@testing-library/jest-dom";


// Mock correto do AdapterDayjs
vi.mock("@mui/x-date-pickers/AdapterDayjs", async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual };
  });
  
  describe("BasicDateField Component", () => {
    it("deve renderizar o DateField com o rótulo correto", () => {
      render(<BasicDateField label="Data de Nascimento" value={dayjs("2025-02-16")} />);
      expect(screen.getByLabelText("Data de Nascimento")).toBeInTheDocument();
    });
  
    it("deve renderizar com a data correta", () => {
      render(<BasicDateField label="Data" value={dayjs("2025-02-16")} />);
      const input = screen.getByLabelText("Data");
      expect(input.value).toContain("2025");
    });

  
    it("deve lidar com valores undefined ou nulos", () => {
      render(<BasicDateField label="Data" value={null} />);
      expect(screen.getByLabelText("Data")).toBeInTheDocument();
    });
  });