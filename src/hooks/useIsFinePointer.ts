import { useEffect, useState } from "react";

/** True only for devices with a real mouse (not touch), used to gate
 * desktop-only interactions like the custom cursor and magnetic buttons. */
export function useIsFinePointer(): boolean {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFine(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isFine;
}
