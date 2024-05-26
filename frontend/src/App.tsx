import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import WorldMap from "./WorldMap";
import { CountryTopList } from "./components/CountryTopList";
import {
    Box,
    Flex,
    Heading,
    SegmentedControl,
    Spinner,
    Strong,
    Text,
} from "@radix-ui/themes";
import { Slider } from "./components/Slider";
import { SegmentState } from "./components/Segments";
import Segments from "./components/Segments/Segments";
import { Header } from "./components/Header";
import {
    fetchAnnouncedOnDates,
    fetchRaisedAmount,
    fetchRaisedAmountOnDateByCountry,
} from "./api";

const DATE_TOOLTIP_ID = "date-tooltip";

const dummyData = {
    USA: 0.8,
    CAN: 0.2,
    MEX: 0.5,
};

const MAP_SIZE = {
    width: 960,
    height: 500,
} as const;

const plotDataInitialState = {
    normalizedData: dummyData,
    originalData: dummyData,
};

function createNormalizedData(data: Record<string, number>) {
    const maxValue = Math.max(...Object.values(data));

    const normalizedData: Record<string, number> = {};

    const originalData: Record<string, number> = {};
    for (const key in data) {
        normalizedData[key] = data[key] / maxValue;
        originalData[key] = data[key];
    }
    return { normalizedData, originalData };
}

type PlotDataSate = {
    normalizedData: Record<string, number>;
    originalData: Record<string, number>;
};
function MapExplanation() {
    return (
        <>
            <Text>
                This map visualize the total funding on each country.
                <br />
                Based the the amount of funding the color of the country will change.{" "}
                <br />
                The value is normalized to the highest value.
                <br />
            </Text>
            <div className="flex gap-2 items-center">
                <Text>
                    <Strong> The color scale is from white to orange</Strong>
                </Text>
                <Box width="16px" height="16px" className="bg-white border" />
                <Box width="16px" height="16px" className="bg-orange-400 border" />
            </div>
        </>
    );
}
function App() {
    const [dates, setDates] = useState<string[]>([]);
    const [plotData, setPlotData] = useState<PlotDataSate>(plotDataInitialState);

    const [sinceBeginningPlotData, setSinceBeginningPlotData] =
        useState<PlotDataSate | null>(null);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [segmentState, setSegmentState] = useState<SegmentState>(
        SegmentState.FundingBasedOnDate,
    );

    const uncontrolledSlidingDate = useRef<HTMLElement | null>(null);

    const callNewFundingsByCountryWithDate = useCallback(
        ({ date }: { date: string }) => {
            fetchRaisedAmountOnDateByCountry({
                date,
                result: (data) => {
                    setPlotData(createNormalizedData(data.results.raisedAmount));
                    setSelectedDate(date);
                },
            });
        },
        [],
    );
    useEffect(() => {
        fetchAnnouncedOnDates({
            result: (data) => {
                setDates(data.results);
                const initialDate = data.results[0];
                callNewFundingsByCountryWithDate({ date: initialDate });
            },
        });
    }, [callNewFundingsByCountryWithDate]);

    const onSegmentChange = (newSegment: SegmentState) => {
        setSegmentState(newSegment);
        if (
            newSegment === SegmentState.FundingSinceBeginning &&
            !sinceBeginningPlotData
        ) {
            fetchRaisedAmount({
                result: (data) => {
                    setSinceBeginningPlotData(
                        createNormalizedData(data.results.raisedAmount),
                    );
                },
            });
        }
    };
    const originalData = useMemo(() => {
        if (segmentState === SegmentState.FundingBasedOnDate) {
            return plotData.originalData;
        }
        if (segmentState === SegmentState.FundingSinceBeginning) {
            return sinceBeginningPlotData?.originalData ?? {};
        }
        return plotData.originalData;
    }, [plotData, segmentState, sinceBeginningPlotData]);

    const setSliderDebounced = useMemo(() => {
        const setSliderDebounce = debounce(callNewFundingsByCountryWithDate, 400);
        return (event: number[]) => {
            if (uncontrolledSlidingDate.current) {
                const dataToolTip =
                    uncontrolledSlidingDate.current.getElementsByTagName(
                        DATE_TOOLTIP_ID,
                    )?.[0];

                if ("innerText" in dataToolTip) dataToolTip.innerText = dates[event[0]];
            }
            const target = Number(event[0]);
            const date = dates[target];
            return setSliderDebounce({ date });
        };
    }, [dates, callNewFundingsByCountryWithDate]);

    const setUncontrolledSlidingDateNode = useCallback(
        (node: HTMLElement | null) => {
            if (node === null) return;
            uncontrolledSlidingDate.current = node;
        },
        [],
    );

    if (dates.length === 0) {
        return;
    }
    return (
        <div className="flex items-center w-full justify-center">
            <div className="max-w-[1280px]">
                <div className="py-6">
                    <Flex direction="row" gap="4" className="flex-1">
                        <div className="relative w-[350px]">
                            <CountryTopList header="Top list" items={originalData} />
                        </div>
                        <Flex direction="column" className="flex-1" gap="4">
                            <SegmentedControl.Root
                                onValueChange={(segment: SegmentState) => {
                                    onSegmentChange(segment);
                                }}
                                variant="surface"
                                size="3"
                                defaultValue={SegmentState.FundingBasedOnDate}
                            >
                                <SegmentedControl.Item
                                    value={SegmentState.FundingBasedOnDate}
                                    className="cursor-pointer"
                                >
                                    <Heading size="2">Countries funding based on date</Heading>
                                </SegmentedControl.Item>
                                <SegmentedControl.Item
                                    value={SegmentState.FundingSinceBeginning}
                                    className="cursor-pointer"
                                >
                                    <Heading size="2">Countries funding since beginning</Heading>
                                </SegmentedControl.Item>
                            </SegmentedControl.Root>

                            <Segments
                                segmentState={segmentState}
                                FundingSinceBeginning={
                                    <>
                                        {sinceBeginningPlotData ? (
                                            <>
                                                <Header title="Countries funding since beginning" />
                                                <MapExplanation />
                                                <WorldMap
                                                    plotData={sinceBeginningPlotData.normalizedData}
                                                    width={MAP_SIZE.width}
                                                    height={MAP_SIZE.height}
                                                />
                                            </>
                                        ) : (
                                            <Box
                                                width={`${MAP_SIZE.width.toString()}px`}
                                                height={`${MAP_SIZE.height.toString()}px`}
                                                className="flex items-center justify-center"
                                            >
                                                <Spinner size="3" />
                                            </Box>
                                        )}
                                    </>
                                }
                                FundingBasedOnDate={
                                    <>
                                        <Header title="Countries funding based on date"></Header>
                                        <MapExplanation />
                                        <Flex direction="column" gap="4">
                                            <Heading size="2" className="text-left">
                                                {selectedDate}
                                            </Heading>
                                            <Slider
                                                data={dates}
                                                containerId={DATE_TOOLTIP_ID}
                                                setSliderRef={setUncontrolledSlidingDateNode}
                                                onValueChange={setSliderDebounced}
                                            />
                                            <Text>
                                                <Strong>
                                                    Slide to see the funding on different dates
                                                </Strong>
                                            </Text>
                                            <WorldMap
                                                plotData={plotData.normalizedData}
                                                width={MAP_SIZE.width}
                                                height={MAP_SIZE.height}
                                            />
                                        </Flex>
                                    </>
                                }
                            />
                        </Flex>
                    </Flex>
                </div>
            </div>
        </div>
    );
}

export default App;
