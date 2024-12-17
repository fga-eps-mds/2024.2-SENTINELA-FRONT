import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PermissionProtect from "./permissionProtect";
import AuthContext from "../Context/auth";
import { getRoleById } from "../Services/RoleService/roleService";
import { checkAction } from "../Utils/permission";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../Services/RoleService/roleService", () => ({
  getRoleById: vi.fn(),
}));

vi.mock("../Utils/permission", () => ({
  checkAction: vi.fn(),
}));

describe("PermissionProtect Component", () => {
  const mockUser = {
    id: "123",
    role: "admin",
  };

  const renderComponent = (user, moduleName, actions) => {
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContext.Provider value={{ user }}>
          <Routes>
            <Route
              path="/"
              element={
                <PermissionProtect
                  element={<div>Protected Content</div>}
                  moduleName={moduleName}
                  actions={actions}
                />
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it("should render 'Loading...' while fetching permissions", () => {
    getRoleById.mockResolvedValueOnce({ permissions: [] });

    renderComponent(mockUser, "module1", ["read"]);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render the protected element when user has permission", async () => {
    getRoleById.mockResolvedValueOnce({
      permissions: [{ module: "module1", actions: ["read"] }],
    });
    checkAction.mockReturnValue(true);

    renderComponent(mockUser, "module1", ["read"]);

    await waitFor(() => {
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  it("should navigate to '/unauthorized' when user does not have permission", async () => {
    getRoleById.mockResolvedValueOnce({
      permissions: [{ module: "module1", actions: [] }],
    });
    checkAction.mockReturnValue(false);

    renderComponent(mockUser, "module1", ["write"]);

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  it("should navigate to '/unauthorized' when user role is not defined", async () => {
    renderComponent({}, "module1", ["read"]);

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });
});
