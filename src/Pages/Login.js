import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import logo from "../media/512.png";
import { firebaseAuth, firestore } from "../firebase";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";

export class login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      show_progress: false,
    };

    this.handleChange = this.handleChange.bind();
    this.login = this.login.bind();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  login = () => {
    let valid_data = true;
    this.state.email_error = null;
    this.state.password_error = null;

    if (this.state.email === "") {
      this.state.email_error = "Required!";
      valid_data = false;
    }

    if (this.state.password === "") {
      this.state.password_error = "Required!";
      valid_data = false;
    }

    if (valid_data) {
      this.show_progress = true;
    }

    this.setState({
      update: true,
    });

    if (valid_data) {
      firestore
        .collection("USERS")
        .where("email", "==", this.state.email)
        .where("IsAdmin", "==", true)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            firebaseAuth
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then((res) => {
                this.props.history.replace("/");
              })
              .catch((err) => {
                if (err.code === "auth/wrong-password") {
                  this.state.password_error = "Incorrect Password!";
                }
                this.setState({
                  show_progress: false,
                });
              });
          } else {
            this.state.email_error = "Not Allowed!";
            this.setState({
              show_progress: false,
            });
          }
        });
    }
  };

  render() {
    return (
      <Container maxWidth="sm">
        <Box
          bgcolor="white"
          boxShadow="2"
          borderRadius="15px"
          textAlign="center"
          p="24px"
          mt="50px"
        >
          <img src={logo} height="50px" />
          <Typography variant="h5" color="textSecondary">
            ADMIN
          </Typography>
          <TextField
            label="Email"
            id="outlined-size-small"
            variant="outlined"
            fullWidth
            name="email"
            error={this.state.email_error != null}
            helperText={this.state.email_error}
            onChange={this.handleChange}
            color="secondary"
            margin="normal"
            size="small"
          />

          <TextField
            label="Password"
            type="password"
            id="outlined-size-small"
            variant="outlined"
            fullWidth
            name="password"
            error={this.state.password_error != null}
            helperText={this.state.password_error}
            onChange={this.handleChange}
            color="secondary"
            margin="normal"
            size="small"
          />
          <br />
          <br />
          {this.state.show_progress ? (
            <CircularProgress size={24} thickness={5} color="primary" />
          ) : null}
          <br />
          <br />
          <Button
            disableElevation
            variant="contained"
            onClick={this.login}
            color="primary"
            fullWidth
          >
            LOGIN
          </Button>
        </Box>
      </Container>
    );
  }
}

export default login;
