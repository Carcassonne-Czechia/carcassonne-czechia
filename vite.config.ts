import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dsv from "@rollup/plugin-dsv";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        tsconfigPaths(),
        dsv(),
        devtoolsJson(),
    ],
});
