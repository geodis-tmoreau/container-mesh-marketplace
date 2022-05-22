import LineChart from "component/timechart/LineChart";

import { Paper, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useState, useMemo } from "react";
import moment from "moment";
import { useTheme } from "@material-ui/core";
import locationService from "services/location.service";

const containerType = {
    containers20p: "20 GP",
    containers40p: "40 GP",
};

const Charts = ({ location }) => {
    const theme = useTheme();

    const [tabIndex, setTabIndex] = useState("0");

    const tabsName = useMemo(
        () => Object.keys(location?._source?.lo?.thresholds || {}).sort(),
        [location]
    );

    const getData = (id) => {
        return (location?._source?.lo?.stocks[id] || []).map(
            (stock, index) => ({
                x: moment("2022-01-08").add(index, "week").toDate(),
                y: stock,
            })
        );
    };

    const getTabColor = (id) => {
        if (locationService.isSeriesUnderTheshold(location, id)) {
            return theme.palette.error.dark;
        } else if (locationService.isSeriesAboveThreshold(location, id)) {
            return theme.palette.warning.dark;
        }
        return theme.palette.text.primary;
    };

    return (
        location && (
            <TabContext value={tabIndex}>
                <Paper square>
                    <TabList
                        value={tabIndex}
                        onChange={(event, newValue) => setTabIndex(newValue)}
                    >
                        {tabsName.map((id, index) => (
                            <Tab
                                label={containerType[id]}
                                value={"" + index}
                                key={containerType[id]}
                                style={{
                                    color: getTabColor(id),
                                    fontWeight: "bolder",
                                }}
                            />
                        ))}
                    </TabList>
                </Paper>
                {tabsName.map((id, index) => (
                    <TabPanel value={"" + index} key={containerType[id]}>
                        <LineChart
                            containerId="chart-container"
                            markers={[
                                {
                                    axis: "y",
                                    value: location?._source?.lo?.thresholds[id]
                                        .min,
                                    legend: "Minimum",
                                    lineStyle: {
                                        stroke: theme.palette.error.main,
                                        strokeWidth: 3,
                                    },
                                    textStyle: {
                                        stroke: theme.palette.error.dark,
                                    },
                                    legendOrientation: "horizontal",
                                },
                                {
                                    axis: "y",
                                    value: location?._source?.lo?.thresholds[id]
                                        .max,
                                    legend: "Maximum",
                                    lineStyle: {
                                        stroke: theme.palette.warning.main,
                                        strokeWidth: 3,
                                    },
                                    legendOrientation: "horizontal",
                                    textStyle: {
                                        stroke: theme.palette.warning.dark,
                                    },
                                },
                            ]}
                            data={[
                                {
                                    id: "Available container",
                                    color: theme.palette.primary.main,
                                    lineStyle: { strokeWidth: 3 },
                                    data: getData(id),
                                },
                            ]}
                        />
                    </TabPanel>
                ))}
            </TabContext>
        )
    );
};

export default Charts;
