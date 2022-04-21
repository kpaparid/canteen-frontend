import { data } from "autoprefixer";
import { merge } from "lodash";

export const shopToState = (data, meta) => {
  return data?.reduce((a, b) => [...a, mapSettings({ ...b }, meta)], []);
};
const mapSettings = ({ uid, entities, ids }, meta) => {
  switch (uid) {
    case "meal-category":
      return {
        id: "categories",
        value: mapSettingsToCategories({ entities, meals: meta?.meals }),
      };
    default:
      return { id: uid, value: entities.value.value };
  }
};
export const mapSettingsToCategories = ({ entities, meals }) => {
  return (
    Object.keys(entities)?.map((c) => {
      return {
        ...entities[c],
        itemIds: meals?.filter((m) => m.category === c).map((m) => m.id) || [],
      };
    }) || []
  );
};

export const shopToState2 = ({ categories, meals }) => {
  const mappedCategories =
    categories &&
    meals &&
    Object.keys(categories).map((c) => {
      return {
        ...categories[c],
        itemIds: meals?.filter((m) => m.category === c).map((m) => m.id) || [],
      };
    });

  return { categories: mappedCategories };
};
