import { AnnouncedOnResponse, ApiVariablesType } from "./api.types";

export default async function fetchAnnouncedOnDates(
  variables: ApiVariablesType<(data: AnnouncedOnResponse) => void>,
) {
  const { result, error } = variables;

  try {
    const value = await fetch(
      "http://localhost:8080/funding/announced-on",
    ).then((response) => response.json());

    result(value);
  } catch (resError) {
    const errorMessage = "Error inside fetchAnnouncedOnDates";
    console.error(errorMessage, resError);

    error?.({ message: errorMessage, exception: resError });
  }
}
