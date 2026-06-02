import type { Prisma } from "@prisma/client";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDateOnlyToUtcStart(value: string): Date | undefined {
	if (!DATE_ONLY_PATTERN.test(value)) {
		return undefined;
	}

	const [year, month, day] = value.split("-").map(Number);
	const parsed = new Date(Date.UTC(year, month - 1, day));

	if (
		parsed.getUTCFullYear() !== year ||
		parsed.getUTCMonth() !== month - 1 ||
		parsed.getUTCDate() !== day
	) {
		return undefined;
	}

	return parsed;
}

export function parseAuditDateRange(params: {
	dateFrom?: string;
	dateTo?: string;
}): {
	dateFrom?: Date;
	dateToExclusive?: Date;
	invalid: boolean;
} {
	const from = params.dateFrom
		? parseDateOnlyToUtcStart(params.dateFrom)
		: undefined;
	const to = params.dateTo ? parseDateOnlyToUtcStart(params.dateTo) : undefined;

	if ((params.dateFrom && !from) || (params.dateTo && !to)) {
		return { invalid: true };
	}

	if (from && to && from.getTime() > to.getTime()) {
		return { invalid: true };
	}

	return {
		invalid: false,
		dateFrom: from,
		dateToExclusive: to ? new Date(to.getTime() + DAY_IN_MS) : undefined,
	};
}

export function normalizeAuditTextQuery(
	query?: string,
	minLength = 2,
): string | undefined {
	const normalized = query?.trim();
	if (!normalized || normalized.length < minLength) {
		return undefined;
	}
	return normalized;
}

export function buildAuditTextSearchWhere(
	textQuery: string,
): Prisma.AuditEventWhereInput {
	const tokens = textQuery
		.split(/\s+/)
		.map((token) => token.trim())
		.filter((token) => token.length >= 2)
		.slice(0, 4);

	const finalTokens = tokens.length > 0 ? tokens : [textQuery];

	return {
		AND: finalTokens.map((token) => ({
			OR: [
				{ action: { contains: token, mode: "insensitive" } },
				{ entityType: { contains: token, mode: "insensitive" } },
				{ entityId: { contains: token, mode: "insensitive" } },
				{ summary: { contains: token, mode: "insensitive" } },
				{
					actor: {
						is: {
							OR: [
								{
									name: { contains: token, mode: "insensitive" },
								},
								{
									email: { contains: token, mode: "insensitive" },
								},
							],
						},
					},
				},
			],
		})),
	};
}
