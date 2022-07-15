import Menu from "../components/Menu";
import {
  fetchCategoriesThunk,
  fetchMealsThunk,
  fetchSettingsThunk,
  wrapper,
} from "../reducer/redux2";

export default function Home(props) {
  return <Menu {...props} />;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      const shop = store
        .dispatch(fetchMealsThunk())
        .then(({ payload }) => store.dispatch(fetchCategoriesThunk(payload)));

      const promises = [
        store.dispatch(fetchSettingsThunk({ suffix: "?uid=shopIsOpen" })),
        shop,
      ];
      await Promise.all(promises);
      return {
        props: {},
      };
    }
);
