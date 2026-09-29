import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts", // Bundle registers one or more manifests
      formats: ["es"],
      fileName: "umbraco-media-inventory-report",
    },
    outDir: "../wwwroot/App_Plugins/UmbracoMediaInventoryReport", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
      // Umbraco loads the package entry point from a fixed URL. Keeping its
      // dynamically imported manifests in this same file prevents an older
      // cached entry point from requesting a chunk that a package upgrade has
      // already replaced.
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
