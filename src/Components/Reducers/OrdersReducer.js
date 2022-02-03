const initState = null;

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_ORDERS":
      state = action.payload;
      break;

    case "UPDATE_ORDERS":
      let list = [...state];
      let index = state.indexOf(
        list.filter((item) => item.id === action.payload.id)[0]
      );
      list[index] = action.payload;
      state = list;

      break;

    default:
      break;
  }
  return state;
};

export default orderReducer;
