import { ScrollArea, Separator, Text } from "@radix-ui/themes";
import CountryTopListHeader from "./CountryTopListHeader";
import { formatCurrency, useCountryTopList } from "../utils";

type Props = {
  content: ReturnType<typeof useCountryTopList>["data"];
};
export default function CountryListRemainingCountries(props: Props) {
  const { content } = props;
  return (
    <>
      <CountryTopListHeader />
      <Separator my="3" size="4" />
      <ScrollArea type="always" scrollbars="vertical" style={{ height: 300 }}>
        {content.map((item) => (
          <div className="grid grid-cols-12" key={item.country}>
            <Text className="col-span-9">
              {formatCurrency().format(item.totalFoundedAmount)}
            </Text>
            <Text className="col-span-3">{item.country}</Text>
            <Separator my="3" size="4" className="col-span-full" />
          </div>
        ))}
      </ScrollArea>
    </>
  );
}
