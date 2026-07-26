import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("PDF asset worker", () => {
	it("serves the configured root file at /", async () => {
		const request = new Request("http://example.com/");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe("application/pdf");
	});

	it("serves an existing asset by filename", async () => {
		const response = await SELF.fetch("http://example.com/file.pdf");
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe("application/pdf");
	});

	it("redirects a missing file to the root path", async () => {
		const response = await SELF.fetch("http://example.com/does-not-exist.pdf", {
			redirect: "manual",
		});
		expect(response.status).toBe(301);
		expect(response.headers.get("location")).toBe("http://example.com/");
	});
});
