// @ts-nocheck
import { POST } from "@/app/api/ai/generate-question/route";

describe("POST /api/ai/generate-question", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns 200 and improved text when upstream succeeds", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "Improved content" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const req = new Request("http://localhost/api/ai/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "t", content: "c" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toContain("Improved content");
  });

  it("returns 502 when upstream fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response("bad", { status: 401, statusText: "Unauthorized" })
      );

    const req = new Request("http://localhost/api/ai/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "t", content: "c" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json.success).toBe(false);
  });
});
