import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'imown1',
  viewportHeight: 800,
  viewportWidth: 1200,
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
