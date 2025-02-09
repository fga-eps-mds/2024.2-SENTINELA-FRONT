// usePermissions.test.js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { checkAction, checkModule } from "./permission";

// Test data
const permissions = [
  {
    module: "users",
    access: ["read", "write"],
  },
  {
    module: "settings",
    access: ["read", "write"],
  },
  {
    module: "dashboard",
    access: ["view", "edit"],
  },
];

describe("checkModule", () => {
  it('should return true for existing module "users"', () => {
    expect(checkModule(permissions, "users")).toBe(true);
  });

  it('should return true for existing module "settings"', () => {
    expect(checkModule(permissions, "settings")).toBe(true);
  });

  it('should return true for existing module "dashboard"', () => {
    expect(checkModule(permissions, "dashboard")).toBe(true);
  });

  it('should return false for non-existing module "profile"', () => {
    expect(checkModule(permissions, "profile")).toBe(false);
  });
});

describe("checkAction", () => {
  beforeEach(() => {
    localStorage.setItem(
      "@App:permissions",
      JSON.stringify([
        { module: "users", actions: ["read", "write"] },
        { module: "settings", actions: ["read", "write"] },
      ])
    );
  });

  afterEach(() => {
    localStorage.clear();
  });
  it('should return true for action "read" in module "users"', () => {
    expect(checkAction("read")).toBe(true);
  });

  it('should return true for action "write" in module "users"', () => {
    expect(checkAction("write")).toBe(true);
  });

  it('should return true for action "read" in module "settings"', () => {
    expect(checkAction("read")).toBe(true);
  });

  it('should return false for action "delete" in module "dashboard"', () => {
    expect(checkAction("delete")).toBe(false);
  });
});
