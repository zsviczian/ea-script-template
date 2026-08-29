import { build } from "esbuild";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "dist/main.js",
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: false,
  sourcemap: false,
  banner: {
    js: `/* EA Script — ${pkg.name} v${pkg.version} */`,
  },
  footer: {
    js: `/* end of bundle */`,
  },
  logLevel: "info",
});
