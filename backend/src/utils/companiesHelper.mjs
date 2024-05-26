export function removeDuplicatesFromCompanies(companies, companyNames) {
  return companies
    .filter((company) => companyNames.includes(company.company_name))
    .reduce((acc, current) => {
      if (!acc || acc.length === 0) {
        return [current];
      }
      const val = acc?.find(
        (item) => item.company_name === current.company_name,
      );
      if (!val) {
        return [...acc, current];
      }
      return acc;
    }, []);
}
