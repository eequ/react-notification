import { useCallback, useEffect, useRef } from "react";

export type UseTimeoutFnReturn = [() => void, () => void];

const useTimeout = (fn: Function, ms: number = 0): UseTimeoutFnReturn => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const set = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  useEffect(() => {
    set();

    return clear;
  }, [ms]);

  return [clear, set];
};

export default useTimeout;
