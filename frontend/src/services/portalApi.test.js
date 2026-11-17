import { afterEach, describe, expect, it, vi } from "vitest";
import { getPortalData } from "./portalApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("portal data loading", () => {
  it("propagates backend connection failures instead of returning an empty dataset", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));

    await expect(
      getPortalData({
        role: "professor",
        user: { rmProfessor: "12345" },
      }),
    ).rejects.toThrow(
      "Não foi possível conectar ao servidor. Verifique se a API Java está disponível.",
    );
  });
});
