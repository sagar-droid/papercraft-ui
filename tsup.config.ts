import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Several components use hooks/context; mark the bundle as a client module for RSC frameworks.
  banner: { js: '"use client";' },
});
