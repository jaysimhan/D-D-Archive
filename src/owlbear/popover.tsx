import React from "react";
import ReactDOM from "react-dom/client";
import OBR from "@owlbear-rodeo/sdk";
import { OwlbearDice } from "./OwlbearDice";
import "../index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Outside Owlbear the SDK never readies, so say where this page belongs.
const outside = window.setTimeout(() => {
    root.render(
        <p style={{ fontFamily: "Inter, sans-serif", padding: 24, color: "#444" }}>
            This is the D&D Archive dice roller for Owlbear Rodeo. Add it to Owlbear with
            the manifest at <code>/owlbear/manifest.json</code>.
        </p>,
    );
}, 3000);

OBR.onReady(() => {
    window.clearTimeout(outside);
    root.render(
        <React.StrictMode>
            <OwlbearDice />
        </React.StrictMode>,
    );
});
