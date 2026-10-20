import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

export function SheetPinDialog({ mode, busy, error, onClose, onSubmit }: {
    mode: "create" | "unlock" | "pin";
    busy: boolean;
    error: string;
    onClose: () => void;
    onSubmit: (pin: string) => Promise<void>;
}) {
    const [pin, setPin] = useState("");
    const [confirm, setConfirm] = useState("");
    const [validation, setValidation] = useState("");
    const choosing = mode !== "unlock";
    return (
        <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
            <DialogContent className="border-zinc-700 bg-zinc-950 text-white"
                onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }}
                onInteractOutside={(event) => { if (busy) event.preventDefault(); }}>
                <DialogTitle>{mode === "create" ? "Set this character’s PIN" : mode === "pin" ? "Change character PIN" : "Unlock editing"}</DialogTitle>
                <DialogDescription className="text-zinc-300">
                    {mode === "create"
                        ? "Choose a four-digit PIN before creating this character’s shared link. Your browser keeps editing access; anyone with the PIN can edit and save from another device."
                        : mode === "pin"
                            ? "Choose a new four-digit PIN for this character. Other browsers will need the new PIN to edit."
                            : "Enter this character’s four-digit PIN. Saved changes will be visible to everyone using its shared link."}
                </DialogDescription>
                <form className="flex flex-col gap-4" onSubmit={(event) => {
                    event.preventDefault();
                    if (!/^\d{4}$/.test(pin)) { setValidation("Enter exactly four digits."); return; }
                    if (choosing && pin !== confirm) { setValidation("The PINs do not match."); return; }
                    setValidation("");
                    void onSubmit(pin);
                }}>
                    <label className="flex flex-col gap-2 text-sm">
                        {choosing ? "Choose PIN" : "Character PIN"}
                        <input autoFocus type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4}
                            autoComplete="off" required disabled={busy} value={pin}
                            onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 4)); setValidation(""); }}
                            className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-xl tracking-[0.6em]" />
                    </label>
                    {choosing && <label className="flex flex-col gap-2 text-sm">
                        Confirm PIN
                        <input type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4}
                            autoComplete="off" required disabled={busy} value={confirm}
                            onChange={(event) => { setConfirm(event.target.value.replace(/\D/g, "").slice(0, 4)); setValidation(""); }}
                            className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-xl tracking-[0.6em]" />
                    </label>}
                    {(validation || error) && <p role="alert" className="text-sm text-red-300">{validation || error}</p>}
                    <button type="submit" disabled={busy}
                        className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 disabled:opacity-50">
                        {busy ? "Please wait…" : mode === "create" ? "Save & create link" : mode === "pin" ? "Update PIN" : "Unlock editing"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
