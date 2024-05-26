import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = 3000;
// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    preview: {
        port: PORT,
        strictPort: true,
    },
    server: {
        port: PORT,
        strictPort: true,
        host: true,
        origin: `http://0.0.0.0:${PORT}`,
    },
});
