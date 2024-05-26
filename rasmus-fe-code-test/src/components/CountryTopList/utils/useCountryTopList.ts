import { RaisedFoundsPerCountry } from "../../../types";

type CountryListItemData = {
  totalFoundedAmount: number;
  country: string;
};

function createCountryListItems(
  items: RaisedFoundsPerCountry,
): CountryListItemData[] {
  return Object.entries(items)
    .map(([country, totalFoundedAmount]) => ({
      country,
      totalFoundedAmount,
    }))
    .sort((a, b) => b.totalFoundedAmount - a.totalFoundedAmount);
}
export default function useCountryTopList(items: RaisedFoundsPerCountry) {
  return {
    chunk: (from: number, to?: number) => {
      if (to) return createCountryListItems(items).slice(from, to);
      return createCountryListItems(items).slice(from);
    },
    data: createCountryListItems(items),
  };
}
