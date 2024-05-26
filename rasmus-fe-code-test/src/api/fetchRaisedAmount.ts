import { ApiVariablesType, RaisedAmountResponse } from "./api.types";

export default async function fetchRaisedAmount(
  variables: ApiVariablesType<(data: RaisedAmountResponse) => void>,
) {
  const { result, error } = variables;

  try {
    const value = await fetch(
      `http://localhost:8080/question/raised-amount`,
    ).then((response) => response.json());

    result(value);
  } catch (resError) {
    const errorMessage = "Error inside fetchRaisedAmount";
    console.error(errorMessage, resError);

    error?.({ message: errorMessage, exception: resError });
  }
}
