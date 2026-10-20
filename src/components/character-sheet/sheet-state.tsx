import {
    createContext, useCallback, useContext, useLayoutEffect, useRef, useState,
    useSyncExternalStore, type Dispatch, type SetStateAction, type ReactNode,
    type InputHTMLAttributes, type TextareaHTMLAttributes,
} from "react";
import { SheetSession } from "../../lib/sheet-session";

export const SheetSessionContext = createContext<SheetSession | null>(null);
const ScopeContext = createContext("");

export function SheetScope({ name, children }: { name: string; children: ReactNode }) {
    const parent = useContext(ScopeContext);
    return <ScopeContext.Provider value={`${parent}/${name}`}>{children}</ScopeContext.Provider>;
}

const noSubscribe = () => () => {};
/** Explicit field keys remain stable across navigation, reloads and layout changes. */
export function useSheetState<T>(name: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>, (value: T) => void] {
    const session = useContext(SheetSessionContext);
    const scope = useContext(ScopeContext);
    const key = `${scope}/${name}`;
    const [fallback, setFallback] = useState(initial);
    const defaultValue = useRef(fallback);
    const getValue = useCallback(() => {
        const value = session?.fields[key];
        // Reject mismatched field types from damaged or manually edited links.
        if (value === undefined) return defaultValue.current;
        if (defaultValue.current !== null && defaultValue.current !== undefined &&
            (value === null || typeof value !== typeof defaultValue.current ||
                Array.isArray(value) !== Array.isArray(defaultValue.current))) return defaultValue.current;
        return value as T;
    }, [session, key]);
    const value = useSyncExternalStore(session?.subscribe ?? noSubscribe, getValue, getValue);
    useLayoutEffect(() => { session?.seed(key, defaultValue.current); }, [session, key]);
    const setValue = useCallback<Dispatch<SetStateAction<T>>>((next) => {
        if (!session) { setFallback(next); return; }
        session.set(key, typeof next === "function" ? (next as (value: T) => T)(getValue()) : next);
    }, [session, key, getValue]);
    const deriveValue = useCallback((next: T) => {
        if (session) session.derive(key, next);
        else setFallback(next);
    }, [session, key]);
    return [session ? value : fallback, setValue, deriveValue];
}

export function SheetInput({ defaultValue = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
    const [value, setValue] = useSheetState(`input:${props["aria-label"]}`, String(defaultValue));
    return <input {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
}

export function SheetTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const [value, setValue] = useSheetState(`text:${props["aria-label"]}`, "");
    return <textarea {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
}
