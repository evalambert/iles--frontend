//src/hook/isDesktop.js
import { useState, useEffect } from "react";

/**
 * Hook global pour savoir si on est sur desktop.
 * @param {number} breakpoint - largeur minimum en px (default = 1024)
 */
export function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    update(); // première exécution
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isDesktop;
}