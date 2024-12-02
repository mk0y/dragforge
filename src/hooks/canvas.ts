import { init } from "ramda";
import { RefObject, useCallback, useEffect } from "react";
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import { useAppStore } from "./app-store";
import { useStore } from "./use-store";

export const useRowHeights = (ref: RefObject<ImperativePanelGroupHandle>) => {
  const rowSizes = useStore(useAppStore, (state) => state.rowSizes);
  const currentPage = useStore(useAppStore, (state) => state.currentPage);
  const getElement = useCallback(() => ref.current, [ref]);
  useEffect(() => {
    const ref = getElement();
    if (ref && currentPage) {
      const resizeObserver = new ResizeObserver(() => {
        const element = document.getElementById("resizable-panel-canvas");
        if (element && rowSizes) {
          const canvasHeight = element.offsetHeight;
          if (canvasHeight > 0) {
            const newLayout: number[] = [];
            init(rowSizes[currentPage]).forEach((rowSize) => {
              const percentage = (rowSize / canvasHeight) * 100;
              newLayout.push(percentage);
            });
            const lastElement =
              100 - newLayout.reduce((sum, num) => sum + num, 0);
            setTimeout(() => ref.setLayout([...newLayout, lastElement]), 45);
          }
        }
      });
      const targetElement = document.getElementById("resizable-panel-canvas");
      if (targetElement) {
        resizeObserver.observe(targetElement);
      }
      return () => {
        if (targetElement) {
          resizeObserver.unobserve(targetElement);
        }
      };
    }
  }, [rowSizes]);
};
