import getOrganizationBasedOnCompany from "./getOrganizationBasedOnCompany.mjs";
import { removeDuplicatesFromCompanies } from "./utils/companiesHelper.mjs";
import createCompanyQuery from "./utils/createCompanyQuery.mjs";
import createRaisedFundingPerCountry from "./utils/createRaisedFundingPerCountry.mjs";

async function allTimeTophitsFundings(client) {
  const response = await client.search({
    index: "funding_corrected",
    body: {
      size: 0,
      aggs: {
        top_fundings: {
          top_hits: {
            sort: [
              {
                raised_amount_usd: {
                  order: "desc",
                },
              },
            ],

            _source: {
              includes: ["company_name", "raised_amount_usd"],
            },
            size: 100,
          },
        },
      },
    },
  });

  const biggestFundingsForACompany =
    response.body.aggregations.top_fundings.hits.hits.map((agg) => agg._source);

  const companyNames = biggestFundingsForACompany.map((c) => c.company_name);

  const companyQuery = createCompanyQuery(companyNames);
  const companiesInfo = await getOrganizationBasedOnCompany(
    client,
    companyQuery,
  );

  const companiesResponse = removeDuplicatesFromCompanies(
    companiesInfo,
    companyNames,
  );

  const raisedAmount = createRaisedFundingPerCountry(
    companiesResponse,
    biggestFundingsForACompany,
  );
  return { biggestFundingsForACompany, raisedAmount };
}
export default allTimeTophitsFundings;
