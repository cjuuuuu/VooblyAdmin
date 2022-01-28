import { Container } from "@material-ui/core";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { connect } from "react-redux";

import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { loadOrders } from "../Components/Actions/OrdersAction";
import { firestore } from "../firebase";

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class ManageCategoryFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        // { title: "Name", field: "categoryName" },
        // { title: "Name", field: "index", type: "numeric" },

        /////
        { title: "Name", field: "product_title" },
        { title: "Order Status", field: "product_subtitle" },
        { title: "Payment Status", field: "product_price" },
        // { title: "Total Amount", field: "Total Amount", type: "numeric" },
        // { title: "Total Items", field: "Total Items", type: "numeric" },
        // {
        //   title: "Total Items Price",
        //   field: "Total Items Price",
        //   type: "numeric",
        // },

        // {
        //   title: "name",
        //   field: "icon",
        //   render: (rowData) => (
        //     <img
        //       src={rowData.icon}
        //       style={{ width: 40, borderRadius: "50%" }}
        //     />
        //   ),
        // },
      ],
      data: props.orderList,
    };
  }
  componentDidMount() {
    if (this.props.orderList === null) {
      this.props.loadOrders(
        () => {
          this.setState({ loading: false });
        },
        () => {
          this.setState({ loading: false });
          //Error
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <Container>
          <MaterialTable
            icons={tableIcons}
            table="Orders"
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  resolve();

                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    console.log(this.props.newData);
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }),

              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();

                  if (oldData) {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;

                      return { ...prevState, data };
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }),
            }}
          />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderList: state.orderList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadOrders: (onSuccess, onError) =>
      dispatch(loadOrders(onSuccess, onError)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCategoryFragment);
