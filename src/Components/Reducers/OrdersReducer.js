const initState = null;

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_ORDERS":
      state = action.payload;
      break;
    default:
      break;
  }
  return state;
};

export default orderReducer;
