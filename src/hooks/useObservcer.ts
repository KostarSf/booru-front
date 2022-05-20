import { useEffect, useRef } from "react";

export const useObserver = (
  ref: React.MutableRefObject<any>,
  canLoad: boolean,
  isLoading: boolean,
  callback: Function,
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    var cb = function (entries: any, observer: any) {
      if (entries[0].isIntersecting && canLoad) {
        callback();
      }
    };
    observer.current = new IntersectionObserver(cb);
    observer.current.observe(ref.current);
  }, [isLoading]);
};
