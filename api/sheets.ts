import { createSheetHandler, sanitySheetRepository } from "../server/shared-sheets.js";

export default createSheetHandler(() => sanitySheetRepository(process.env));
