import { data } from "autoprefixer";
import { merge } from "lodash";

export const shopToState = ({ categories, meals }) => {
  const mappedCategories = Object.keys(categories).map((c) => {
    return {
      ...categories[c],
      itemIds: meals?.filter((m) => m.category === c).map((m) => m.id) || [],
    };
  });

  return { meals, categories: mappedCategories };
};
