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
            orderList.push({ id: doc.id, ...doc.data() });
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

export const updateOrders = (data, onSuccess, onError) => {
  return (dispatch, getState) => {
    firestore
      .collection("PRODUCTS")
      .doc(data.id)
      .update(data)
      .then(function (doc) {
        console.log(doc);
        dispatch({ type: "UPDATE_ORDERS", payload: data });
        onSuccess();
      })
      .catch((error) => {
        console.log(error);
        onError();
      });
  };
};
