import * as RadixAccordion from "@radix-ui/react-accordion";

type Props = {
  Trigger: React.ReactNode;
  Content: React.ReactNode;
  type?: "single";
  value: string;
  preCollapsed?: boolean;
};
export default function Accordion(
  props: Props
) {
  const {
    Trigger,
    Content,
    preCollapsed,
    type = "single",
    value,
  } = props;

  return (
    <RadixAccordion.Root
      type={type}
      defaultValue={
        preCollapsed ? value : undefined
      }
      collapsible
    >
      <RadixAccordion.Item
        value={value}
        className="mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b"
      >
        <RadixAccordion.Trigger
          className="group"
          asChild
        >
          {Trigger}
        </RadixAccordion.Trigger>
        <RadixAccordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
          {Content}
        </RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
}
