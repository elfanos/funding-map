import { RaisedFoundsPerCountry } from "../../types";
import { Button, Flex, Heading } from "@radix-ui/themes";
import {
  CountryListTopThree,
  CountryListRemainingCountries,
} from "./components";
import { useCountryTopList } from "./utils";
import { Accordion } from "../Accordion";
type Props = {
  header: string;
  items: RaisedFoundsPerCountry;
};

const NUMBER_OF_VISUAL_COUNTRIES = 3;

export default function CountryTopList(props: Props) {
  const { items } = props;

  const countryTopList = useCountryTopList(items);

  const restOfTheCountries = countryTopList.chunk(NUMBER_OF_VISUAL_COUNTRIES);

  return (
    <Accordion
      Trigger={
        <div className="px-4">
          <Button className="w-full cursor-pointer" variant="surface" size="3">
            <Heading size="2">Top list</Heading>
          </Button>
        </div>
      }
      preCollapsed
      value="country-top-list"
      Content={
        <Flex direction="column" className="px-4 py-6 items-stretch gap-8">
          <CountryListTopThree
            content={countryTopList.chunk(0, NUMBER_OF_VISUAL_COUNTRIES)}
          />
          <Accordion
            value="country-top-list-remaining"
            Trigger={
              <div className="mb-6">
                <Button
                  className="w-full cursor-pointer"
                  variant="surface"
                  size="3"
                >
                  <Heading size="2">More countries</Heading>
                </Button>
              </div>
            }
            Content={
              <CountryListRemainingCountries content={restOfTheCountries} />
            }
          />
        </Flex>
      }
    />
  );
}
