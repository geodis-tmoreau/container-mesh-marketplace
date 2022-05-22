import { useState } from "react";
import kuzzleService from "services/kuzzle/kuzzle.service";
import AvailabilityTable from "./AvailabilityTable";
import FilterForm from "./FilterForm";

const RentTab = ({ locations = [] }) => {
    const [displayAvailability, setDisplayAvailability] = useState(false);
    const onSearch = async ({}) => {
        console.log("onSeach");
        console.log(locations);
        setDisplayAvailability(true);
    };

    return (
        <>
            <FilterForm onSearch={onSearch} locations={locations} />{" "}
            {displayAvailability && <AvailabilityTable />}
        </>
    );
};

export default RentTab;
