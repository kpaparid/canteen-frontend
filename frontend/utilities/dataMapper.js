import { data } from "autoprefixer";
import { merge } from "lodash";

export const shopToState = (menu) => {
  const items = Object.keys(menu).reduce(
    (c, key) => [
      ...c,
      ...menu[key].data.reduce((a, b) => [...a, { ...b, category: key }], []),
    ],
    []
  );
  const categories = Object.keys(menu).reduce(
    (a, b) => [
      ...a,
      {
        id: b,
        text: menu[b].text,
        itemIds: menu[b].data.map((d) => d.id),
      },
    ],
    []
  );

  return { items, categories };
};
