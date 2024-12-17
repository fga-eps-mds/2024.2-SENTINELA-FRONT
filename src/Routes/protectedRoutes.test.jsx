import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./protectedRoutes";
import AuthContext from "../Context/auth";

vi.mock("./permissionProtect", () => ({
  default: ({ element }) => element,
}));

vi.mock("../Pages/Protected/Unauthorized", () => ({
  default: () => <div>Unauthorized</div>,
}));

vi.mock("../Pages/Protected/Home", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("../Pages/Protected/Supplier/CreateSupplier", () => ({
  default: () => <div>Create Supplier</div>,
}));

vi.mock("../Pages/Protected/Users/userListPage", () => ({
  default: () => <div>User List Page</div>,
}));

describe("ProtectedRoutes Component", () => {
  const mockUser = {
    id: "123",
    role: "admin",
  };

  const renderProtectedRoutes = (user) => {
    return render(
      <MemoryRouter initialEntries={["/home"]}>
        <AuthContext.Provider value={{ user }}>
          <Routes>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the Home page for the '/home' route", async () => {
    renderProtectedRoutes(mockUser);

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("should render 'Create Supplier' page for '/fornecedores/criar' route", async () => {
    render(
      <MemoryRouter initialEntries={["/fornecedores/criar"]}>
        <AuthContext.Provider value={{ user: mockUser }}>
          <Routes>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Create Supplier")).toBeInTheDocument();
    });
  });

  it("should render 'User List Page' for '/usuarios' route", async () => {
    render(
      <MemoryRouter initialEntries={["/usuarios"]}>
        <AuthContext.Provider value={{ user: mockUser }}>
          <Routes>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("User List Page")).toBeInTheDocument();
    });
  });

  it("should render 'Unauthorized' page when route is not allowed", async () => {
    render(
      <MemoryRouter initialEntries={["/unauthorized"]}>
        <Routes>
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });
});
