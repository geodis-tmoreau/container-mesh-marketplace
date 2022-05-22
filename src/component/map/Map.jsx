import React, { useMemo, useState, useEffect } from "react";

import { default as MapGl } from "react-map-gl";
import { FormControlLabel, FormGroup, Radio } from "@material-ui/core";
import Area from "./Area";
import Point from "./Point";
// import pointInPolygon from "point-in-polygon";
import {useTheme} from "@material-ui/core"

const defaultInitialViewState = {
    longitude: 4.055902168167609,
    latitude: 51.954313975405015,
    zoom: 12,
};

const defaultMapsSettings = [
    {
        mapStyle: "mapbox://styles/mapbox/satellite-v9",
        isChecked: false,
        label: "Satelite view",
    },
    {
        mapStyle: "mapbox://styles/mapbox/dark-v10",
        isChecked: true,
        label: "Street view",
    },
];

/**
 * @typedef {Object} InitialViewState
 * @property {number} longitude
 * @property {number} latitude
 * @property {number} zoom
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} longitude
 * @property {number} latitude
 */

/**
 * @typedef {Object} AreaData
 * @property {string} id
 * @property {Coordinates[]} coordinates
 * @property {string} backgroundColor
 * @property {number} backgroundOpacity
 * @property {string} borderColor
 * @property {number} borderWidth
 * @property {string} textColor
 * @property {string} content
 */

/**
 * @typedef {Object} PointData
 * @property {string} id
 * @property {Coordinates} coordinates
 * @property {string} color
 * @property {string} textColor
 * @property {number} radius
 * @property {string} content
 * @property {Function} onClick
 */

/**
 *
 * @param {Object} param0
 * @param {Object} param0.viewState
 * @param {Function} param0.onMove
 * @param {string} param0.selected
 * @param {AreaData[]} param0.areaData
 * @param {PointData[]} param0.pointsData
 * @param {boolean} param0.disableModeSwitch
 * @returns
 */
const Map = ({
    viewState,
    onMove,
    areaData = [],
    pointsData = [],
    disableModeSwitch = false,
    selected=null
}) => {
    const theme = useTheme();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [mapsSettings, setMapSettings] = useState(defaultMapsSettings);

    useEffect(() => {
        const handleResize = () => {
            const pageContainer = document.getElementById("page-container");
            setWidth(pageContainer.offsetWidth - 48);
            setHeight(480);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onSelectMode = (label) => (event) => {
        mapsSettings.forEach((settings) => {
            if (label === settings.label) {
                settings.isChecked = event.target.checked;
            } else {
                settings.isChecked = false;
            }
        });
        setMapSettings([...mapsSettings]);
    };

    return (
        <div>
            {!disableModeSwitch && (
                <FormGroup>
                    {mapsSettings.map((settings) => (
                        <FormControlLabel
                            key={settings.label}
                            control={
                                <Radio
                                    checked={settings.isChecked}
                                    onChange={onSelectMode(settings.label)}
                                />
                            }
                            label={settings.label}
                        />
                    ))}
                </FormGroup>
            )}

            <MapGl
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                viewState={viewState}
                onMove={onMove}
                style={{ width, height }}
                mapStyle={
                    mapsSettings.find((settings) => settings.isChecked).mapStyle
                }

            // onMouseMove={onMouseMove}

            >
                {areaData.map((area) => (
                    <Area
                        key={area.id}
                        id={area.id}
                        coordinates={area.coordinates}
                        backgroundColor={area.backgroundColor}
                        backgroundOpacity={area.backgroundOpacity}
                        borderColor={area.borderColor}
                        borderWidth={area.borderWidth}
                        textColor={area.textColor}
                        content={area.content}
                    />
                ))}
                {pointsData.map((point) => (
                    <Point
                        key={point.id}
                        id={point.id}
                        coordinates={point.coordinates}
                        color={point.color}
                        // color={point.id === selected ? theme.palette.primary.main : point.color}
                        selected={point.id === selected}
                        radius={point.radius}
                        textColor={point.textColor}
                        content={point.content}
                        onClick={point.onClick}
                    />
                ))}
            </MapGl>
        </div>
    );
};

export default Map;
