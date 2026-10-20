import type { Plugin, ViteDevServer, PreviewServer } from "vite";
import { createSheetHandler, sanitySheetRepository } from "./shared-sheets.js";

/** Serve the identical API in npm run dev/preview and Vercel production. */
export function sharedSheetsPlugin(env: Record<string, string>): Plugin {
    const handler = createSheetHandler(() => sanitySheetRepository(env));
    const install = (server: ViteDevServer | PreviewServer) => {
        server.middlewares.use((req, res, next) => {
            if (new URL(req.url || "/", "http://localhost").pathname !== "/api/sheets") return next();
            void handler(req, res);
        });
    };
    return { name: "shared-sheets-api", configureServer: install, configurePreviewServer: install };
}
