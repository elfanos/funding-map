import { Separator, Text } from "@radix-ui/themes";
import { formatCurrency, useCountryTopList } from "../utils";
import CountryTopListHeader from "./CountryTopListHeader";

type Props = {
  content: ReturnType<typeof useCountryTopList>["data"];
};

export default function CountryTopListTopThree(props: Props) {
  const { content } = props;
  return (
    <div>
      <CountryTopListHeader />
      <Separator my="3" size="4" />
      {content.map((item) => (
        <div key={item.country} className="grid grid-cols-12">
          <Text className="col-span-9">
            {formatCurrency().format(item.totalFoundedAmount)}
          </Text>
          <Text className="col-span-3">{item.country}</Text>
          <Separator my="3" size="4" className="col-span-full" />
        </div>
      ))}
    </div>
  );
}
