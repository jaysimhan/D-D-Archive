export default {
    name: "sharedSheet",
    title: "Shared Character Sheet",
    type: "document",
    readOnly: true,
    fields: [
        { name: "ownerHash", type: "string", title: "Owner fingerprint", hidden: true },
        { name: "payload", type: "text", title: "Compressed sheet data", readOnly: true },
    ],
    preview: {
        select: { id: "_id", updated: "_updatedAt" },
        prepare({ id, updated }: { id: string; updated: string }) {
            return { title: `Shared sheet ${id.replace("sharedSheet.", "")}`, subtitle: `Saved ${updated}` };
        },
    },
};
