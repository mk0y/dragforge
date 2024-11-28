"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "./app-store";

type EventType = MouseEvent | TouchEvent;

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: EventType) => void
) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;
    const listener = (event: EventType) => {
      if (startedInside || !startedWhenMounted) return;
      if (event.target instanceof Node) {
        if (!ref.current || ref.current.contains(event.target)) return;
      }
      handler(event);
    };

    const validateEventStart = (event: EventType) => {
      if (event.target instanceof Node) {
        startedWhenMounted = !!ref.current;
        startedInside = !!ref.current && ref.current.contains(event.target);
      }
    };

    const onMouseDown = (event: MouseEvent) => validateEventStart(event);
    const onTouchStart = (event: TouchEvent) => validateEventStart(event);
    const onClick = (event: MouseEvent) => listener(event);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
    };
  }, [ref, handler]);
};

export const useIsPageLoaded = () => {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
  }, []);
  return ref.current;
};

export const useAppStorePersistence = () => {
  return useAppStore.persist;
}
