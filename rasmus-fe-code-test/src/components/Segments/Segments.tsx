import { SegmentState } from "./utils";

type Props = Record<keyof typeof SegmentState, React.ReactNode> & {
  segmentState: SegmentState;
};

export default function Segments(props: Props) {
  const { segmentState, FundingBasedOnDate, FundingSinceBeginning } = props;
  switch (segmentState) {
    case SegmentState.FundingBasedOnDate:
      return FundingBasedOnDate;
    case SegmentState.FundingSinceBeginning:
      return FundingSinceBeginning;
    default:
      return null;
  }
}
