import { describe, expect, it } from "vitest";
import { computeCohensKappa } from "@/lib/report/agreement";

describe("agreement metrics", () => {
	it("returns neutral metrics for empty set", () => {
		const metrics = computeCohensKappa({
			total: 0,
			aYesBYes: 0,
			aYesBNo: 0,
			aNoBYes: 0,
			aNoBNo: 0,
		});

		expect(metrics.kappa).toBe(0);
		expect(metrics.agreementRate).toBe(0);
	});

	it("computes perfect agreement", () => {
		const metrics = computeCohensKappa({
			total: 10,
			aYesBYes: 4,
			aYesBNo: 0,
			aNoBYes: 0,
			aNoBNo: 6,
		});

		expect(metrics.kappa).toBe(1);
		expect(metrics.agreementRate).toBe(1);
	});

	it("computes intermediate agreement", () => {
		const metrics = computeCohensKappa({
			total: 20,
			aYesBYes: 6,
			aYesBNo: 2,
			aNoBYes: 4,
			aNoBNo: 8,
		});

		expect(metrics.kappa).toBeGreaterThan(0);
		expect(metrics.kappa).toBeLessThan(1);
	});
});
