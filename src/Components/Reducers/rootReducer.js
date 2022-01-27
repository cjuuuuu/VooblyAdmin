import { combineReducers } from "redux";
import categoryPageReducer from "./categoryPageReducer";
import categoryReducer from "./categoryReducer";
import orderReducer from "./OrdersReducer";

const DEFAULT_REDUCER = (initstate, action) => {
  return {
    key: "HELLO WORLD",
  };
};

const rootReducer = combineReducers({
  DEFAULT: DEFAULT_REDUCER,
  categories: categoryReducer,
  categoryPages: categoryPageReducer,
  orderList: orderReducer,
});
export default rootReducer;
