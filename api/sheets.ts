import { createSheetHandler, sanitySheetRepository } from "../server/shared-sheets";

export default createSheetHandler(() => sanitySheetRepository(process.env));
