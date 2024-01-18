import { defineConfig } from "vite";

export default defineConfig(({ command, mode, _isSsrBuild, isPreview }) => {
  console.log(mode);
  if (mode == "production") {
    return {
      base: "/mazes-in-typescript/",
    };
  }
  return {};
});
