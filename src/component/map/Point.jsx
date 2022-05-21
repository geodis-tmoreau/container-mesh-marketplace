import { Marker } from "react-map-gl";

const Point = ({
    id,
    content = "",
    coordinates,
    color,
    textColor = "#000",
    radius = 10,
    selected,
    onClick = null
}) => {
    return (
        <Marker
            longitude={coordinates.longitude}
            latitude={coordinates.latitude}
            anchor="center"
            onClick={onClick}
            
        >
            <div
                style={{
                    borderRadius: 50,
                    border: `solid ${selected ? 2 : 0 }px yellow`,
                    width: radius,
                    height: radius,
                    backgroundColor: color,
                    verticalAlign: "middle",
                    color: textColor,
                    display: "inline-block",
                    cursor: "pointer",
                }}
            >
                <span style={{
                    width: "200px",
                    position: "absolute",
                    textAlign: "center",
                    top: `-${radius}px`,
                    left: `-100px`,
                    fontWeight: "bolder",
                    zIndex: "100"
                }}>{content}</span>
            </div>
        </Marker>
    );
};

export default Point;
