export const STOCK_MANAGER = "stockManager";
export const TRANSPORTER = "transporter";

export const actors = [
    {id: "msc", label: "MSC", type:STOCK_MANAGER},
    {id: "cmacgm", label: "CMA-CGM", type:TRANSPORTER}
  ];


export const locations= [
  {id:"", label:""}
]

export const steps = [
  {name: "USLAX overstocked", date: ""},
  {name: "NLRTM understocked", date: "", todo: [
    "validation manuelle du forecast",
    "proposal bateau 5k contianers",
    "validation de la proposal",
    "creation du service dans 1R"
  ]}, 
  {name: "Execution of service MSC transport NLRTM", date: "", todo: []}, 
]