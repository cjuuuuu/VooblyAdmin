import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete, FormatColorFill } from "@material-ui/icons";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./ManageCategoryFragment";
import firebase, { firestore, storageRef } from "../firebase";

class AddProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      COD: false,
      loading: false,
      variation_type: "variation_selection",
      product_title: { error: "", value: "" },
      price: { error: "", value: "" },
      cutted_price: { error: "", value: "0" },
      free_coupons: { error: "", value: "0" },
      variation_title: { error: "", value: "" },
      anount: { error: "", value: "" },
      coupon_title: { error: "", value: "" },
      coupon_body: { error: "", value: "" },
      max_quantity: { error: "", value: "0" },
      offer_applied: { error: "", value: "0" },
      description: { error: "", value: "" },
      other_details: { error: "", value: "" },
      stock_quantity: { error: "", value: "0" },
      tags: { error: "", value: "" },
      type: { error: "", value: "Sale" },

      columns: [
        { title: "Key", field: "field" },
        { title: "Value", field: "value" },
      ],
      data: [],
    };
  }

  renderImageUrl = (item) => {
    try {
      return URL.createObjectURL(item);
    } catch (error) {
      return item;
    }
  };

  removeImage = (index) => {
    let images = this.state.images;

    let image = images[index];
    images.splice(index, 1);

    try {
      if (image.startsWith("https")) {
        this.setState(
          {
            loading: true,
          }
          //   this.deleteImages([image], 0, () => {
          //     this.setState({
          //       loading: false,
          //       images,

          //     });
          //   })
        );
      }
    } catch (error) {
      this.setState({
        images,
      });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: { error: "", value: e.target.value },
    });
  };

  uploadImages = (images, index, urls, onCompleted) => {
    const uploadAgain = (images, index, urls, onCompleted) =>
      this.uploadImages(images, index, urls, onCompleted);
    let file = images[index];
    try {
      if (file.startsWith("https")) {
        urls.push(file);
        index++;
        if (index < images.length) {
          uploadAgain(images, index, urls, onCompleted);
        } else {
          onCompleted();
        }
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0,
        out = "";

      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }
      let filename = "banner" + out;

      var uploadTask = storageRef
        .child("Products/" + filename + ".jpg")
        .put(file);

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {
          // Handle unsuccessful uploads
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
            urls.push(downloadUrl);
            index++;
            if (index < images.length) {
              uploadAgain(images, index, urls, onCompleted);
            } else {
              onCompleted();
            }
          });
        }
      );
    }
  };

  uploadProducts = (e) => {
    if (this.state.images.length === 0) {
      return;
    }

    if (this.state.tabChecked && this.state.data.length === 0) {
      return;
    }

    let mandatoryFields = [
      " product_title",
      " price",
      " coupon_title",
      " coupon_body",
      " max_quantity",
      " description",
      " other_details",
      " stock_quantity",
      " tags",
    ];

    if (this.state.attachVariation) {
      let variationFields = [" variation_title", " anount"];
      mandatoryFields = [...mandatoryFields, ...variationFields];
    }

    let uploadSignal = true;

    // mandatoryFields.forEach((element) => {
    //   let field = this.state[element];
    //   if (field.value === "") {
    //     field.error = "Required!";
    //     uploadSignal = false;
    //   }
    // });

    if (!uploadSignal) {
      this.setState({});
      return;
    }

    let index = 0;
    let urls = [];
    this.setState({
      loading: true,
    });
    this.uploadImages(this.state.images, index, urls, () => {
      let data = {
        added_on: firebase.firestore.Timestamp.fromDate(new Date()),
        no_of_product_images: urls.length,
        product_title: this.state.product_title.value,
        product_price: this.state.price.value,
        cutted_price: this.state.cutted_price.value,
        free_coupens: this.state.free_coupons.value,
        free_coupen_body: this.state.coupon_body.value,
        free_coupen_title: this.state.coupon_title.value,
        [" max-quantity"]: this.state.max_quantity.value,
        offers_applied: this.state.offer_applied.value,
        product_description: this.state.description.value,
        tags: this.state.tags.value.split(","),
        // COD: this.state.COD.value,
        average_rating: "",
        // use_tab_layout: this.state.tabChecked.value,
      };

      if (this.state.attachVariation) {
        data["amount"] = this.state.amount.value;
        data["body"] = this.state.body.value;
        // data["type"] = this.state.type.value;
      }

      if (this.state.tabChecked) {
        let sectionCount = 0;
        let index = 0;

        this.state.data.forEach((row) => {
          if (row.field === "title") {
            data["spec_title_" + sectionCount + "_total_fields"] = index;
            index = 0;
            sectionCount++;
            data["spec_title_" + sectionCount] = row.value;
          } else {
            index++;
            data["spec_title_" + sectionCount + "_field_" + index + "_name"] =
              row.field;
            data["spec_title_" + sectionCount + "_field_" + index + "_value"] =
              row.value;
          }
        });
        data["total_spec_titles"] = sectionCount;
      }

      urls.forEach((url, index) => {
        data["product_image" + (index + 1)] = url;
      });

      firestore
        .collection("ZUMKA")

        .add(data)
        .then(function (doc) {
          let docId = doc.Id;
          // for (let index = 0; index < parseInt(this.state.).length; index++) {
          //   const element = array[index];

          // }
          this.setState({
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          //error
        });
    });
  };

  render() {
    return (
      <Box bgcolor="white" boxShadow={1} p={4}>
        <Typography variant="h5" gutterBottom>
          New Product
        </Typography>
        <Box display="flex" flexWrap="true">
          {this.state.images.map((item, index) => (
            <Box margin="22px">
              <img
                src={this.renderImageUrl(item)}
                style={{
                  height: "90px",
                  width: "160px",

                  objectFit: "scale-down",
                }}
              />
              <br />

              <IconButton
                aria-label="delete"
                onClick={(e) => this.removeImage(index)}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>

        <input
          accept="image/*"
          id="contained-button-file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              let images = this.state.images;

              images.push(e.target.files[0]);

              this.setState({
                images,
              });
              e.target.value = null;
            }
          }}
          hidden
          name="images"
          type="file"
        />
        <br />
        {this.state.images.length < 8 ? (
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Add Image
            </Button>
          </label>
        ) : null}
        <br />

        <TextField
          fullWidth
          margin="normal"
          label="Product Title"
          id="outlined-size-small"
          onChange={this.onChange}
          name="product_title"
          error={this.state.product_title.error !== ""}
          helperText={this.state.product_title.error}
          defaultValue={this.state.product_title.value}
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          label="Product Price"
          onChange={this.onChange}
          name="price"
          type="number"
          id="outlined-size-small"
          variant="outlined"
          error={this.state.price.error !== ""}
          helperText={this.state.price.error}
          defaultValue={this.state.price.value}
          size="small"
        />

        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Cutted Price"
          onChange={this.onChange}
          name="cutted_price"
          type="number"
          id="outlined-size-small"
          error={this.state.cutted_price.error !== ""}
          helperText={this.state.cutted_price.error}
          defaultValue={this.state.cutted_price.value}
          variant="outlined"
          size="small"
        />

        <br />
        <TextField
          margin="normal"
          label="Free Coupons"
          type="number"
          id="outlined-size-small"
          onChange={this.onChange}
          name="free_coupons"
          error={this.state.free_coupons.error !== ""}
          helperText={this.state.free_coupons.error}
          defaultValue={this.state.free_coupons.value}
          variant="outlined"
          size="small"
        />
        <br />

        <FormControlLabel
          control={
            <Switch
              name="attach_variation"
              color="primary"
              onChange={(e) =>
                this.setState({
                  attachVariation: e.target.checked,
                })
              }
            />
          }
          label="Attach Variation"
        />
        <Box
          border={1}
          p={4}
          borderRadius={8}
          hidden={!this.state.attachVariation}
        >
          <RadioGroup
            aria-label="gender"
            name="variation_type"
            defaultValue="variation_selection"
          >
            <FormControlLabel
              value="variation_selection"
              control={<Radio />}
              label="Variation Selection"
            />
          </RadioGroup>

          <TextField
            margin="normal"
            label="Variation Title"
            onChange={this.onChange}
            name="variation_title"
            id="outlined-size-small"
            variant="outlined"
            error={this.state.variation_title.error !== ""}
            helperText={this.state.variation_title.error}
            defaultValue={this.state.variation_title.value}
            size="small"
          />

          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Amount"
            type="number"
            onChange={this.onChange}
            name="anount"
            error={this.state.anount.error !== ""}
            helperText={this.state.anount.error}
            defaultValue={this.state.anount.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
        </Box>
        <br />
        <TextField
          margin="normal"
          label="Coupon Title"
          onChange={this.onChange}
          name="coupon_title"
          id="outlined-size-small"
          variant="outlined"
          error={this.state.coupon_title.error !== ""}
          helperText={this.state.coupon_title.error}
          defaultValue={this.state.coupon_title.value}
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Coupon Body"
          multiline
          onChange={this.onChange}
          name="coupon_body"
          fullWidth
          rows={4}
          error={this.state.coupon_body.error !== ""}
          helperText={this.state.coupon_body.error}
          defaultValue={this.state.coupon_body.value}
          variant="outlined"
        />

        <br />
        <TextField
          margin="normal"
          label="Max Quantity"
          type="number"
          onChange={this.onChange}
          name="max_quantity"
          id="outlined-size-small"
          error={this.state.max_quantity.error !== ""}
          helperText={this.state.max_quantity.error}
          defaultValue={this.state.max_quantity.value}
          variant="outlined"
          size="small"
        />

        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Offers Applied"
          type="number"
          onChange={this.onChange}
          name="offer_applied"
          id="outlined-size-small"
          variant="outlined"
          error={this.state.offer_applied.error !== ""}
          helperText={this.state.offer_applied.error}
          defaultValue={this.state.offer_applied.value}
          size="small"
        />
        <br />

        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Descriptions"
          multiline
          onChange={this.onChange}
          name="description"
          fullWidth
          rows={4}
          error={this.state.description.error !== ""}
          helperText={this.state.description.error}
          defaultValue={this.state.description.value}
          variant="outlined"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="use_tab_layout"
              color="primary"
              onChange={(e) =>
                this.setState({
                  tabChecked: e.target.checked,
                })
              }
            />
          }
          label="Use Tab Layout"
        />
        {this.state.tabChecked && (
          <MaterialTable
            icons={tableIcons}
            table="Specifications"
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
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
        )}

        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Other Detailes"
          multiline
          onChange={this.onChange}
          name="other_details"
          error={this.state.other_details.error !== ""}
          helperText={this.state.other_details.error}
          defaultValue={this.state.other_details.value}
          fullWidth
          rows={4}
          variant="outlined"
        />

        <br />
        <TextField
          margin="normal"
          label="Stock Quantity"
          type="number"
          onChange={this.onChange}
          name="stock_quantity"
          error={this.state.stock_quantity.error !== ""}
          helperText={this.state.stock_quantity.error}
          defaultValue={this.state.stock_quantity.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />

        <br />

        <FormControlLabel
          control={
            <Switch
              name="COD"
              color="primary"
              onChange={(e) =>
                this.setState({
                  COD: e.target.checked,
                })
              }
            />
          }
          label="COD"
        />

        <br />

        <TextField
          margin="normal"
          label="Tags"
          onChange={this.onChange}
          name="tags"
          fullWidth
          error={this.state.tags.error !== ""}
          helperText={this.state.tags.error}
          defaultValue={this.state.tags.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <br />
        <Button
          variant="contained"
          fullWidth
          color="primary"
          component="span"
          onClick={this.uploadProducts}
        >
          Upload
        </Button>
        <Backdrop style={{ zIndex: 1500 }} open={this.state.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Box>
    );
  }
}

export default AddProducts;
