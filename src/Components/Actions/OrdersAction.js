import { firestore } from "../../firebase";

export const loadOrders = (onSuccess, onError) => {
  return (dispatch, getState) => {
    firestore
      .collection("PRODUCTS")
      // .orderBy("index")
      .get()
      .then((querySnapshot) => {
        let orderList = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            orderList.push(doc.data());
          });
          dispatch({ type: "LOAD_ORDERS", payload: orderList });
          onSuccess();
        }
      })
      .catch((error) => {
        console.log(error);
        onError();
      });
  };
};
