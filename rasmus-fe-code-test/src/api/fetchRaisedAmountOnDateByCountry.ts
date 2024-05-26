import { ApiVariablesType, RaisedAmountByCountry } from "./api.types";

export default async function fetchRaisedAmountOnDateByCountry(
  variables: ApiVariablesType<
    (data: RaisedAmountByCountry) => void,
    { date: string }
  >,
) {
  const { date, result, error } = variables;

  try {
    const value = await fetch(
      `http://localhost:8080/question/raised-amount-by-country?date=${date}`,
    ).then((response) => response.json());

    result(value);
  } catch (resError) {
    const errorMessage = "Error inside fetchRasedAmountOnDateByCountry";
    console.error(errorMessage, resError);

    error?.({ message: errorMessage, exception: resError });
  }
}
