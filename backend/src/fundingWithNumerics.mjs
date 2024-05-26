export default function indexFunding(client) {
  async function createNewIndex() {
    await client.indices.create({
      index: "funding_corrected",
      body: {
        mappings: {
          properties: {
            announced_on: { type: "date" },
            company_name: { type: "text" },
            company_uuid: { type: "keyword", index: false },
            funding_round_uuid: { type: "keyword", index: false },
            investment_type: { type: "keyword" },
            investor_names: { type: "keyword" },
            raised_amount_usd: { type: "double" },
          },
        },
      },
    });
  }
  async function reindexData() {
    await client.reindex({
      body: {
        source: { index: "funding" },
        dest: { index: "funding_corrected" },
        script: {
          source: `
          ctx._source.raised_amount_usd = ctx._source.raised_amount_usd != null ? Double.parseDouble(ctx._source.raised_amount_usd) : 0.0;
        `,
        },
      },
    });
  }
  return async function () {
    await createNewIndex();
    await reindexData();
  };
}
