export default function createRaisedFundingPerCountry(
  companiesResponse,
  fundings,
) {
  let raisedAmount = {};

  for (const company of companiesResponse) {
    const funding = fundings.find(
      (f) => f.company_name === company.company_name,
    );

    const amount = raisedAmount[company.country_code];

    raisedAmount[company.country_code] = amount
      ? amount + Number(funding.raised_amount_usd)
      : Number(funding.raised_amount_usd);
  }

  return raisedAmount;
}
