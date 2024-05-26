function createCompanyQuery(companies) {
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
}

export default createCompanyQuery;
