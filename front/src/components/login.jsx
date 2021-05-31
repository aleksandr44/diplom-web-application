import React from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "axios";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      login: null,
      password: null,
      userType: null,
      value: 0,
    };
  }

  setValue = (value) => {
    this.setState({ value: value });
  };

  handleChange = (event, newValue) => {
    this.setValue(newValue);
  };

  handleLoginChange = (e) => {
    this.setState({ login: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleUserTypeChange = (e) => {
    this.setState({ userType: e.target.value });
  };

  login = () => {
    axios
      .post("http://127.0.0.1:8000/login/", {
        login: this.state.login,
        password: this.state.password,
        userType: this.state.userType
      })
      .then((response) => {
        this.setState({ isLoading: false });
        this.props.login.is_student = !!response.data?.is_student;
        this.props.login.is_teacher = response.data?.is_teacher;
        this.props.login.login = response.status == 200;
        this.props.login.user_id = response.data.user_id;
        this.props.isLogged(response.status == 200, response.data.user_id);
        this.props.inputError(response.status !== 200);
        sessionStorage.setItem("is_student", this.props.login.is_student);
        sessionStorage.setItem("is_teacher", this.props.login.is_teacher);
        sessionStorage.setItem("login", this.props.login.login);
        sessionStorage.setItem("user_id", this.props.login.user_id);
        this.forceUpdate();
        this.props.update();
        window.location.reload();
      })
      .catch((error) => {
        this.props.inputError(true);
        console.log(error);
      });
    this.handleClose();
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  logout = () => {
    sessionStorage.setItem("is_student", null);
    sessionStorage.setItem("is_teacher", null);
    sessionStorage.setItem("login", null);
    sessionStorage.setItem("user_id", null);
    this.props.isLogged(null);
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Вход</DialogTitle>
          <DialogContent>
            <DialogContentText>Введите логин и пароль</DialogContentText>
            <AppBar position="static">
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                aria-label="simple tabs example"
              >
                <Tab label="Вход" {...a11yProps(0)} style={{width: '50%'}}/>
                <Tab label="Регистрация" {...a11yProps(1)}  style={{width: '50%'}}/>
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.value} index={0}>
              <TextField
                autoFocus
                margin="dense"
                id="login"
                label="Логин"
                type="login"
                onChange={this.handleLoginChange}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Пароль"
                type="password"
                onChange={this.handlePasswordChange}
                fullWidth
              />
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              <TextField
                autoFocus
                margin="dense"
                id="login"
                label="Логин"
                type="login"
                onChange={this.handleLoginChange}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Пароль"
                type="password"
                onChange={this.handlePasswordChange}
                fullWidth
              />

              <FormControl fullWidth={true}>
                <InputLabel id="demo-simple-select-label" >
                  Тип пользователя
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.userType}
                  onChange={this.handleUserTypeChange}
                >
                  <MenuItem value={'is_teacher'}>Преподаватель</MenuItem>
                  <MenuItem value={'is_student'}>Студент</MenuItem>
                </Select>
              </FormControl>
            </TabPanel>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Отмена
            </Button>
            <Button onClick={this.login} color="primary">
              Войти
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Login;
