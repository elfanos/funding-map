import { Slider as RadixSlider } from "@radix-ui/themes";

const SLIDER_DATE_ID = "date-slider-id";

const SLIDER_DATE_CONTAINER_ID =
  "date-slider-container-id";
type Props = {
  data: string[];
  containerId: string;
  setSliderRef: (
    node: HTMLElement | null
  ) => void;
  onValueChange: (
    value: number[]
  ) => void;
};

export default function Slider(
  props: Props
) {
  const {
    data,
    setSliderRef,
    containerId,
    onValueChange,
  } = props;
  return (
    <RadixSlider
      ref={setSliderRef}
      defaultValue={[0]}
      max={data.length - 1}
      min={0}
      id={SLIDER_DATE_CONTAINER_ID}
      onValueChange={onValueChange}
      onMouseOver={() => {
        const sliderDateContainer =
          document.getElementById(
            SLIDER_DATE_CONTAINER_ID
          );
        const dateTooltipElement =
          document.getElementById(
            containerId
          );
        const collection =
          sliderDateContainer?.getElementsByTagName(
            "span"
          );
        if (!collection) {
          return;
        }
        for (const cell of collection) {
          const status =
            cell.getAttribute("role");

          if (
            status === "slider" &&
            !dateTooltipElement
          ) {
            cell.id = SLIDER_DATE_ID;
            const dateTooltip =
              document.createElement(
                containerId
              );
            dateTooltip.innerText = "";
            dateTooltip.id =
              containerId;
            dateTooltip.style.display =
              "flex";
            dateTooltip.style.position =
              "absolute";
            dateTooltip.style.fontSize =
              "12px";
            dateTooltip.style.minWidth =
              "100px";
            dateTooltip.style.transform =
              "translate(-20px, 20px)";
            cell?.appendChild(
              dateTooltip
            );
          }
        }
      }}
      onMouseLeave={() => {
        const slider =
          document.getElementById(
            SLIDER_DATE_ID
          );
        const dateTooltip =
          document.getElementById(
            containerId
          );
        if (dateTooltip) {
          slider?.removeChild(
            dateTooltip
          );
        }
      }}
    />
  );
}
