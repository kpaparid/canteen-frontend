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
