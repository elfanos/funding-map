# Motherbrain Full Stack Challenge

1. Fork this repo.
2. Ensure [docker](https://www.docker.com/) is installed.
3. Add a `.env` file at the root of the repo with the content `ES_URL=placeholder`. Replace "placeholder" with the url you've received from your contact at EQT.
4. Start the project by running `docker compose up` in the root folder and open http://localhost:3000 in your browser for _further instructions_.

**Alternatively:** Install node locally and run `yarn dev` in the `backend` and `frontend` folders respectively.

## The Challenge

We have configured this repository with a connection to an ElasticSearch node, with two pre populated indices:
- `org` – A collection of organizations. Accessed via http://localhost:8080/orgs.
- `funding` – A collection of [funding rounds](https://techcrunch.com/2017/01/08/wtf-is-a-funding-round/). Accessed via http://localhost:8080/fundings.

The code for these endpoints can be found in `backend/src/index.js`.
We want you to **explore and create a chart or graph of any aspect of the data.** 
Use any charting library you want or whip something up yourself if you prefer that. Points for creativity, both in aesthetics and in data analysis.

This repository is a barebones setup with a Node backend and a React frontend. If you really want to, you can tear it all down and start from scratch, but this is meant to get you started immediately.
