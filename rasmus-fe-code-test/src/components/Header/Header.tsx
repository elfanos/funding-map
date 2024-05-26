import { Flex, Heading } from "@radix-ui/themes";

type Props = React.PropsWithChildren<{ title: string }>;

export default function Header(props: Props) {
  const { children, title } = props;
  return (
    <Flex direction="column" gap="1" className="justify-start">
      <Heading mb="2" size="8" className="">
        {title}
      </Heading>
      {children}
    </Flex>
  );
}
