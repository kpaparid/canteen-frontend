import { intervalToDuration, isAfter, parse } from "date-fns";
import { useEffect, useState } from "react";

export const formatPrice = (price, euro = true) => {
  const pr = parseFloat(price);
  const formattedPrice = pr?.toLocaleString("de-DE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return euro ? formattedPrice + " €" : formattedPrice;
};

export const useIntersection = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element.current && observer.observe(element.current);

    return () => observer.unobserve(element.current);
  }, []);

  return isVisible;
};

export const calcInterval = (start, end) => {
  return isAfter(start, end)
    ? { days: 0, hours: 0, minutes: 0, months: 0, seconds: 0, years: 0 }
    : intervalToDuration({
        start,
        end,
      });
};
export const getDuration = (start, end) => {
  const { hours, minutes } = calcInterval(start, end);
  return hours === 0 && minutes === 0
    ? { moment: { value: "now" } }
    : hours === 0
    ? { minutes: { value: minutes, unit: "min" } }
    : minutes === 0
    ? { hours: { value: hours, unit: "hours" } }
    : hours >= 2
    ? {
        hours: { value: hours, unit: "hours" },
        minutes: { value: minutes, unit: "min" },
      }
    : { minutes: { value: minutes + hours * 60, unit: "min" } };
};
export const useDurationHook = (time) => {
  const endDate = time && parse(time, "HH:mm", new Date());
  const [duration, setDuration] = useState(
    time ? getDuration(new Date(), endDate) : null
  );
  useEffect(() => {
    const interval =
      time &&
      setInterval(() => {
        setDuration(getDuration(new Date(), endDate));
      }, 10000);
    return () => clearInterval(interval);
  }, [time, endDate]);

  return duration;
};
