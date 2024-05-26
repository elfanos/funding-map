import { Heading } from "@radix-ui/themes";
export default function CountryTopListHeader() {
  return (
    <div className="grid grid-cols-12">
      <Heading size="3" className="justify-self-start col-span-9">
        Fundings
      </Heading>
      <Heading size="3" className="justify-self-start col-span-3">
        Country
      </Heading>
    </div>
  );
}
