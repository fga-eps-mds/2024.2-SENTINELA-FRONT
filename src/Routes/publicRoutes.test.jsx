import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PublicRoutes from "./publicRoutes";

vi.mock("../Pages/Public/LoginNovo", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("../Pages/Public/MemberShip", () => ({
  default: () => <div>Membership Page</div>,
}));

vi.mock("../Pages/Public/PasswordRecovery", () => ({
  default: () => <div>Password Recovery Page</div>,
}));

vi.mock("../Pages/Public/ChangePasswordPage", () => ({
  default: () => <div>Change Password Page</div>,
}));

vi.mock("../Pages/Public/VerifyMember/VerifyMemberForm", () => ({
  default: () => <div>Verify Member Form</div>,
}));

vi.mock("../Pages/Public/VerifyMember/VerifyMemberActiveStatus", () => ({
  default: () => <div>Verify Member Active Status</div>,
}));

describe("PublicRoutes Component", () => {
  const renderPublicRoutes = (initialRoute) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render Login page for the '/' route", async () => {
    renderPublicRoutes("/");

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("should render Membership page for the '/filiacao' route", async () => {
    renderPublicRoutes("/filiacao");

    await waitFor(() => {
      expect(screen.getByText("Membership Page")).toBeInTheDocument();
    });
  });

  it("should render Password Recovery page for the '/recuperar-senha' route", async () => {
    renderPublicRoutes("/recuperar-senha");

    await waitFor(() => {
      expect(screen.getByText("Password Recovery Page")).toBeInTheDocument();
    });
  });

  it("should render Change Password page for the '/trocar-senha/:token' route", async () => {
    renderPublicRoutes("/trocar-senha/mockToken");

    await waitFor(() => {
      expect(screen.getByText("Change Password Page")).toBeInTheDocument();
    });
  });

  it("should render Verify Member Form for the '/verificar-membro' route", async () => {
    renderPublicRoutes("/verificar-membro");

    await waitFor(() => {
      expect(screen.getByText("Verify Member Form")).toBeInTheDocument();
    });
  });

  it("should render Verify Member Active Status for the '/verificar-membro/ativo' route", async () => {
    renderPublicRoutes("/verificar-membro/ativo");

    await waitFor(() => {
      expect(screen.getByText("Verify Member Active Status")).toBeInTheDocument();
    });
  });
});
