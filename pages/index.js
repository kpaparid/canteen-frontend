import { useStore } from "react-redux";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { menu } from "../data/menu";
import { fetchShop, wrapper } from "../reducer/redux2";
import { createStore } from "../reducer/store";
import { shopToState } from "../utilities/dataMapper";

export default function Home(props) {
  console.log("State on render", useStore().getState(), props);
  return (
    <div className="h-100">
      {/* <Header /> */}
      <Menu {...props} />
    </div>
  );
}
// export async function getServerSideProps(context) {
//   const initialState = menu;
//   const m = shopToState(menu);

//   const reduxStore = createStore();
//   return { props: { initialState, initialReduxState: reduxStore.getState() } };
// }

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      // const { id } = params;

      await store.dispatch(fetchShop());

      console.log("State on server", store.getState());

      return {
        props: {},
      };
    }
);
