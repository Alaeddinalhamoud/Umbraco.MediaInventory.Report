export const manifests: Array<any> = [
  {
    name: "Media Inventory Report Entrypoint",
    alias: "Umbraco.MediaInventory.Report.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
  {
    type: "dashboard",
    alias: "Umbraco.MediaInventory.Report.MediaInventoryDashboard",
    name: "Media Inventory Dashboard",
    weight: 100,
    meta: {
      label: "Media Inventory",
      icon: "icon-picture",
      pathname: "media-inventory",
    },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "Umb.Section.Media" }],
    element: () => import("../media-inventory-page.js"),
  },
];
