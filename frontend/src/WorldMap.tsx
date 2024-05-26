import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import ibanCountryCodeNumericToAlpha3Code from "./utils/ibanCountryCodeConverter";

type Props = {
  plotData: Record<string, number>;
  width: number;
  height: number;
};

type TopologyJson = Parameters<typeof topojson.feature>[0];

export default function WorldMap(props: Props) {
  const { width, height, plotData } = props;
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getColor = useCallback(
    (key: string) => {
      const aplha3Code = ibanCountryCodeNumericToAlpha3Code[key];
      return plotData[aplha3Code] || 0;
    },
    [plotData],
  );

  useEffect(() => {
    const projection = d3
      .geoEquirectangular()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const interpolatorConfig = d3.interpolateCubehelix.gamma(4)(
      "white",
      "orange",
    );

    const colorScale = d3
      .scaleSequentialQuantile()
      .domain(Object.values(plotData).map((value) => value))
      .interpolator(interpolatorConfig);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    d3.json("https://d3js.org/world-110m.v1.json").then((res) => {
      const world = res as TopologyJson;
      const json = topojson.feature(world, world.objects.countries);

      if ("features" in json) {
        const countries = json.features;

        svg
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5);
        svg
          .selectAll("path")
          .join("path")
          .attr("fill", (svgData) => {
            const data = svgData as {
              id: string;
            };
            const countryCode = data.id;
            const value = getColor(countryCode);
            return value ? colorScale(value) : "#fff";
          });
      }
    });
  }, [getColor, height, plotData, width]);

  return <svg ref={svgRef}></svg>;
}
