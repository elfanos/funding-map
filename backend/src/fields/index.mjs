const fundingFields = {
  announced_on: "announced_on",
  company_name: "company_name",
  investment_type: "investment_type",
  raised_amount_usd: "raised_amount_usd",
};
const orgFields = {
  city: "city",
  company_name: "company_name",
  country_code: "country_code",
  description: "description",
  employee_count: "employee_count",
  funding_rounds: "funding_rounds",
  funding_total_usd: "funding_total_usd",
  short_description: "short_description",
};

export const indexies = {
  org: "org",
  funding: "funding",
  funding_corrected: "funding_corrected",
};
export const fields = {
  [indexies.org]: orgFields,
  [indexies.funding]: fundingFields,
  [indexies.funding_corrected]: fundingFields,
};
