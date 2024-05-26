import { convertTimestampToDate } from "./utils/index.mjs";
import { fields, indexies } from "./fields/index.mjs";

function transformAnnouncedOn(response) {
  return response.sort((a, b) => (a < b ? -1 : 1)).map(convertTimestampToDate);
}
async function announcedOn(client) {
  const response = await client.search({
    index: indexies.funding,
    body: {
      size: 0,
      aggs: {
        [`unique_${fields.funding.announced_on}`]: {
          terms: {
            field: fields.funding.announced_on,
            size: 1000,
          },
        },
      },
    },
  });
  const value = response.body.aggregations[
    `unique_${fields.funding.announced_on}`
  ].buckets.map((bucket) => bucket.key);

  return transformAnnouncedOn(value);
}

export default announcedOn;
