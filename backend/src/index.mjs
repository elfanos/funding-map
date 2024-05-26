import { resolve } from "path";
import http from "http";
import { URL } from "url";
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import companiesFoundedByDate from "./companiesFundedByDate.mjs";
import allTimeTophitsFundings from "./allTimeTophitsFundings.mjs";
import announcedOn from "./announcedOn.mjs";
import { indexies } from "./fields/index.mjs";

const pathname = new URL(import.meta.url).pathname;

const envpath = resolve(pathname, "../../../", ".env");

dotenv.config({
  path: envpath,
});

if (!process.env.ES_URL) {
  console.error(
    "Make sure to update the .env file at the root of the repo with the correct ES_URL before starting the server.",
  );
  process.exit(1);
}

const client = new Client({
  node: process.env.ES_URL,
});

http
  .createServer(handle)
  .listen(8080, () => console.log("Server started at http://localhost:8080"));

async function handle(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url = new URL(`http://incoming${req.url}`);
    switch (`${req.method} ${url.pathname}`) {
      case "GET /orgs":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchOrgs(url.searchParams),
          }),
        );
        break;

      case "GET /fundings":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchFundings(url.searchParams),
          }),
        );
        break;

      case `GET /${indexies.funding}/announced-on`:
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await announcedOn(client),
          }),
        );
        break;

      case `GET /question/raised-amount-by-country`: {
        const date = url.searchParams.get("date");
        if (!date) {
          res.writeHead(400).end(
            JSON.stringify({
              message: "Date is required",
            }),
          );
          break;
        }
        if (!isValidDate(date)) {
          res.writeHead(400).end(
            JSON.stringify({
              message: "Invalid date format",
            }),
          );
          break;
        }

        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await companiesFoundedByDate(client, date),
          }),
        );
        break;
      }

      case `GET /question/raised-amount`: {
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await allTimeTophitsFundings(client),
          }),
        );
        break;
      }

      default:
        res.writeHead(404).end(
          JSON.stringify({
            message: "Not Found",
          }),
        );
        break;
    }
  } catch (e) {
    console.error(e.stack);
    res.writeHead(500).end(
      JSON.stringify({
        message: "Something went wrong",
      }),
    );
  }
}

function isValidDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.match(regex)) return false;
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate);
}
async function searchOrgs(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  const response = await client.search({
    index: "org",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
    },
  });

  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}

async function searchFundings(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  const response = await client.search({
    index: "funding",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
    },
  });

  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}
