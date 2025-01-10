// usePermissions.test.js
import { describe, it, expect } from "vitest";
import { checkAction, checkModule } from "./permission";

// Test data
const permissions = [
  {
    module: "users",
    access: ["read", "write"],
  },
  {
    module: "settings",
    access: ["read"],
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
  it('should return true for action "read" in module "users"', () => {
    expect(checkAction(permissions, "read")).toBe(true);
  });

  it('should return true for action "write" in module "users"', () => {
    expect(checkAction(permissions, "write")).toBe(true);
  });

  it('should return true for action "read" in module "settings"', () => {
    expect(checkAction(permissions, "read")).toBe(true);
  });

  it('should return false for action "write" in module "settings"', () => {
    expect(checkAction(permissions, "write")).toBe(false);
  });

  it('should return true for action "view" in module "dashboard"', () => {
    expect(checkAction(permissions, "view")).toBe(true);
  });

  it('should return true for action "edit" in module "dashboard"', () => {
    expect(checkAction(permissions, "edit")).toBe(true);
  });

  it('should return false for action "delete" in module "dashboard"', () => {
    expect(checkAction(permissions, "delete")).toBe(false);
  });
});
