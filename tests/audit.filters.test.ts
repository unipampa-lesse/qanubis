import { describe, expect, it } from "vitest";
import {
	buildAuditTextSearchWhere,
	normalizeAuditTextQuery,
	parseAuditDateRange,
} from "@/lib/audit/filters";

describe("audit filters", () => {
	it("normalizes search query with minimum length", () => {
		expect(normalizeAuditTextQuery(" a ")).toBeUndefined();
		expect(normalizeAuditTextQuery("  audit ")).toBe("audit");
	});

	it("parses date range as UTC and creates exclusive end", () => {
		const range = parseAuditDateRange({
			dateFrom: "2026-06-01",
			dateTo: "2026-06-03",
		});

		expect(range.invalid).toBe(false);
		expect(range.dateFrom?.toISOString()).toBe("2026-06-01T00:00:00.000Z");
		expect(range.dateToExclusive?.toISOString()).toBe(
			"2026-06-04T00:00:00.000Z",
		);
	});

	it("flags invalid dates and reversed ranges", () => {
		expect(
			parseAuditDateRange({ dateFrom: "2026-02-31", dateTo: "2026-03-01" })
				.invalid,
		).toBe(true);
		expect(
			parseAuditDateRange({ dateFrom: "2026-06-10", dateTo: "2026-06-01" })
				.invalid,
		).toBe(true);
	});

	it("builds tokenized text search structure", () => {
		const where = buildAuditTextSearchWhere("member removed");

		expect(where.AND).toBeDefined();
		expect(Array.isArray(where.AND)).toBe(true);
		expect(where.AND).toHaveLength(2);
	});
});
