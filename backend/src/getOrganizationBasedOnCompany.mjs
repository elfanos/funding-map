export default async function getOrganizationBasedOnCompany(client, query) {
  const response = await client.search({
    index: "org", // Your index name
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
