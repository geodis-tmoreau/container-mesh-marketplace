import moment from "moment";

export const STOCK_MANAGER = "stockManager";
export const TRANSPORTER = "transporter";

export const actors = [
    { id: "msc", label: "MSC", type: STOCK_MANAGER },
    { id: "cmacgm", label: "CMA-CGM", type: TRANSPORTER },
    { id: "mersk", label: "MERSK", type: TRANSPORTER },
];

export const locations = [{ id: "", label: "" }];

export const steps = [
    { name: "USLAX overstocked", date: moment("2022-01-08T00:00:00") },
    {
        name: "NLRTM understocked",
        date: moment("2022-01-15T00:00:00"),
        todo: [
            "validation manuelle du forecast",
            "proposal bateau 5k contianers",
            "validation de la proposal",
            "creation du service dans 1R",
        ],
    },
    {
        name: "Execution of service MSC transport NLRTM",
        date: moment("2022-01-22T00:00:00"),
        todo: [],
    },
];

export const availabilities = [
    {
        carrier: "CMA CGM",
        pickUp: "LAX",
        returnLocation: "RTM",
        leaseRate: 7,
        submitted: false,
    },
    {
        carrier: "MSC",
        pickUp: "LAX",
        returnLocation: "RTM",
        leaseRate: 3,
        submitted: false,
    },
];
