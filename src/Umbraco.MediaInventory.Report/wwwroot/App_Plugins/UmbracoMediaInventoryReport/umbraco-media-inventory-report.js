const e = [
  {
    name: "Media Inventory Report Entrypoint",
    alias: "Umbraco.MediaInventory.Report.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-B0GRwE2y.js")
  },
  {
    type: "dashboard",
    alias: "Umbraco.MediaInventory.Report.MediaInventoryDashboard",
    name: "Media Inventory Dashboard",
    weight: 100,
    meta: {
      label: "Media Inventory",
      icon: "icon-picture",
      pathname: "media-inventory"
    },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "Umb.Section.Media" }],
    element: () => import("./media-inventory-page-BN6G5ofG.js")
  }
], n = [
  ...e
];
export {
  n as manifests
};
//# sourceMappingURL=umbraco-media-inventory-report.js.map
