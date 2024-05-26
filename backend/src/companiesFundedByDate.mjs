import { removeDuplicatesFromCompanies } from "./utils/companiesHelper.mjs";
import createRaisedFundingPerCountry from "./utils/createRaisedFundingPerCountry.mjs";

const createCompanyQuery = (companies) => {
  const uniqueByCompanyName = companies.reduce((acc, current) => {
    if (!acc || acc.length === 0) {
      return [current];
    }
    if (!acc.includes(current)) {
      return [...acc, current];
    } else {
      return acc;
    }
  }, []);
  return uniqueByCompanyName
    .reduce((company, current) => {
      return company + `(company_name:"${current}") OR `;
    }, "")
    .replace(/ OR $/, "");
};

function getCompaniesFromResponse(response) {
  return response.map((res) => res.company_name);
}

function companiesFoundedByDate(client, date) {
  async function getOrganizationBasedOnCompany(query) {
    const response = await client.search({
      index: "org",
      body: {
        size: 1000,
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: query,
                },
              },
            ],
            must_not: [
              {
                term: {
                  country_code: "",
                },
              },
            ],
            filter: [
              {
                exists: {
                  field: "country_code",
                },
              },
            ],
          },
        },
      },
    });

    if (response.body.hits.total.value > 0) {
      return response.body.hits.hits.map((hit) => hit._source);
    } else {
      return null;
    }
  }

  async function getFoundingsByAnnouncedOn(announced_on) {
    const response = await client.search({
      index: "funding", // Your index name
      body: {
        size: 1000,
        query: {
          bool: {
            must: [
              {
                match: { announced_on: announced_on },
              },
            ],
            must_not: [
              {
                term: {
                  raised_amount_usd: "",
                },
              },
            ],

            filter: [
              {
                exists: {
                  field: "raised_amount_usd",
                },
              },
            ],
          },
        },
      },
    });

    if (response.body.hits.total.value > 0) {
      const fundings = response.body.hits.hits
        .map((hit) => hit._source)
        .filter((f) => f.announced_on.includes(announced_on));
      const companies = getCompaniesFromResponse(fundings);
      const companyQuery = createCompanyQuery(companies);
      const companiesInfo = await getOrganizationBasedOnCompany(companyQuery);

      const companiesResponse = removeDuplicatesFromCompanies(
        companiesInfo,
        companies,
      );

      return {
        data: fundings,
        organizations: companiesResponse,
        raisedAmount: createRaisedFundingPerCountry(
          companiesResponse,
          fundings,
        ),
      };
    } else {
      return null;
    }
  }

  return getFoundingsByAnnouncedOn(date);
}

export default companiesFoundedByDate;
