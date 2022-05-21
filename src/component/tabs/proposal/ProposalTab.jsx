import kuzzleService from "services/kuzzle/kuzzle.service";
import FilterForm from "./FilterForm"
import TableProposal from "./TableProposal"
import { useState, useEffect } from "react"

const ProposalTab = ({})=> {
    const [replenishments, setReplenishments] = useState({hits:[]});
    const [locations, setLocations] = useState([])

    useEffect(()=> {
        const loadLocations = async ()=> {setLocations(await kuzzleService.getLocations());}
        loadLocations()
    }, [])

    const onSearch = async ({fromLocation, toLocation, departureDate, arrivalDate, radius, dateRange}) => {
        console.log("onSeach")
        setReplenishments(await kuzzleService.getReplenishments());
        console.log(locations)
    }

    return <>
        <FilterForm onSearch={onSearch} locations={locations} />
        <TableProposal onSearch={onSearch} replenishments={replenishments?.hits} locations={locations} />
    </>;


    
}

export default ProposalTab;