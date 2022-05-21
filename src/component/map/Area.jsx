import { Layer, Marker, Source } from "react-map-gl";

const Area = ({
    id,
    coordinates,
    backgroundColor,
    backgroundOpacity,
    borderColor,
    borderWidth,
    textColor = "#fff",
    content = "",
}) => {
    const onClick = (event) => {
        console.log(event);
    };
    // TODO :: handle click using marker
    // markers and layers are not compatible => marker have width & height = 0 when using layers

    return (
        <Marker
            longitude={coordinates[0].longitude}
            latitude={coordinates[0].latitude}
            anchor="top-left"
            onClick={onClick}
        >
            {/* <div
                style={{
                    width: 100,
                    height: 100,
                    backgroundColor: `${backgroundColor}${Math.round(
                        256 * backgroundOpacity
                    )}`,
                    border: `solid ${borderWidth}px ${borderColor}`,
                    textAlign: "center",
                    color: textColor,
                    display: "inline-block",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        margin: "0",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        msTransform: "translate(-50%, -50%)",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {content}
                </span> */}
            <Source
                id={id}
                type="geojson"
                data={{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            coordinates.map((coordinate) => [
                                coordinate.longitude,
                                coordinate.latitude,
                            ]),
                        ],
                    },
                }}
            >
                <Layer
                    {...{
                        id: `background-${id}`,
                        type: "fill",
                        paint: {
                            "fill-color": backgroundColor, // blue color fill
                            "fill-opacity": backgroundOpacity,
                        },
                    }}
                />
                <Layer
                    {...{
                        id: `outline-${id}`,
                        type: "line",
                        source: "geojson",
                        layout: {},
                        paint: {
                            "line-color": borderColor,
                            "line-width": borderWidth,
                        },
                    }}
                />
            </Source>
            {/* </div> */}
        </Marker>
    );
};

export default Area;
