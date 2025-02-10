// usePermissions.test.js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { checkAction } from "./permission";

describe("checkAction", () => {
  beforeEach(() => {
    localStorage.setItem("@App:permissions", JSON.stringify(["read", "write"]));
  });

  afterEach(() => {
    localStorage.clear();
  });
  it('should return true for action "read"', () => {
    expect(checkAction("read")).toBe(true);
  });

  it('should return true for action "write"', () => {
    expect(checkAction("write")).toBe(true);
  });

  it('should return true for action "read"', () => {
    expect(checkAction("edit")).toBe(false);
  });

  it('should return false for action "delete"', () => {
    expect(checkAction("delete")).toBe(false);
  });
});
