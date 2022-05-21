import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import { darkTheme } from "./darkTheme";
import { defaultTheme } from "@nivo/core";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@material-ui/core";

export const DATE_FORMAT = "DD/MM/YY, HH:MM:SS";

const CustomSymbol =
    (backgroundColor) =>
    ({ size, color, borderWidth, borderColor }) =>
        (
            <g>
                <circle
                    fill={backgroundColor}
                    r={size / 2}
                    strokeWidth={borderWidth}
                    stroke={borderColor}
                />
                <circle
                    r={size / 5}
                    strokeWidth={borderWidth}
                    stroke={borderColor}
                    fill={color}
                    fillOpacity={0.35}
                />
            </g>
        );

/**
 *
 * @param {Object} param
 * @param {import("@nivo/line").Serie[]} param.data
 * @param {import("@nivo/core").CartesianMarkerProps[]} param.markers
 * @param {string} param.containerId
 * @returns
 */
const LineChart = ({ data = [], markers = [] , containerId= "page-container"}) => {
    const theme = useTheme();
    const nivoTheme = useMemo(
        () => (theme.palette.type === "light" ? defaultTheme : darkTheme),
        [theme.palette.type]
    );

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [nbTick, setNbTick] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById(containerId);
            setWidth(container.offsetWidth);
            setHeight(360);
            setNbTick(Math.ceil(container.offsetWidth / 100));
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [containerId]);


    const min = Math.min(...data.flatMap(serie=>serie.data.flatMap(point=>point.y)), ...markers.map(marker=>marker.value));
    const max =Math.max(...data.flatMap(serie=>serie.data.flatMap(point=>point.y)), ...markers.map(marker=>marker.value));
    const margin = Math.max(min-min*0.95, max*1.05-max);

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <ResponsiveLine
                theme={nivoTheme}
                data={data}
                
                margin={{ top: 10, right: 20, bottom: 100, left: 70 }}
                xScale={{
                    type: "time",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                }}
                curve="monotoneX"
                yScale={{
                    type: "linear",
                    min: min > margin ? min - margin : 0 ,
                    max: max + margin,
                    stacked: true,
                    reverse: false,
                }}
                xFormat={(time) => moment(time).format(DATE_FORMAT)}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: "bottom",
                    format: (time) => moment(time).format(DATE_FORMAT),
                    tickValues: nbTick,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legendOffset: 36,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    orient: "left",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,

                    // legend: verticalAxisName,
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
                colors={
                    theme.palette.type === "light"
                        ? theme.palette.primary.dark
                        : "#c9daf8"
                }
                pointSymbol={CustomSymbol(theme.palette.background.paper)}
                pointSize={16}
                pointBorderWidth={1}
                pointBorderColor={{
                    from: "color",
                    modifiers: [["darker", 0.3]],
                }}
                pointLabelYOffset={-12}
                useMesh={true}
                markers={markers}
            />
        </div>
    );
};

export default LineChart;
