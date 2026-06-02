export type AgreementCounts = {
	total: number;
	aYesBYes: number;
	aYesBNo: number;
	aNoBYes: number;
	aNoBNo: number;
};

export type AgreementMetrics = AgreementCounts & {
	agreementRate: number;
	expectedAgreement: number;
	kappa: number;
};

export function computeCohensKappa(counts: AgreementCounts): AgreementMetrics {
	const total = counts.total;
	if (total <= 0) {
		return {
			...counts,
			agreementRate: 0,
			expectedAgreement: 0,
			kappa: 0,
		};
	}

	const aYes = counts.aYesBYes + counts.aYesBNo;
	const aNo = counts.aNoBYes + counts.aNoBNo;
	const bYes = counts.aYesBYes + counts.aNoBYes;
	const bNo = counts.aYesBNo + counts.aNoBNo;

	const observedAgreement = (counts.aYesBYes + counts.aNoBNo) / total;
	const expectedAgreement =
		(aYes / total) * (bYes / total) + (aNo / total) * (bNo / total);

	const denominator = 1 - expectedAgreement;
	const kappa =
		denominator <= 0
			? 0
			: (observedAgreement - expectedAgreement) / denominator;

	return {
		...counts,
		agreementRate: observedAgreement,
		expectedAgreement,
		kappa,
	};
}
