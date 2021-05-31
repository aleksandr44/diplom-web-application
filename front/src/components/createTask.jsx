import React from "react";
import "date-fns";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import TransferList from "./transferList";

import ruLocale from "date-fns/locale/ru";


class CreateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      isLoading: true,
      password: null,
      name: null,
      rules: [],
      students: [],
      types: [],
      rule: null,
      file: null,
      students_in_group: [],
      deadline: null,
      task_type: null,
    };
  }

  handleChange = (event, name) => {
    var obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleChangeFile = (event, name) => {
    var obj = {};
    obj[name] = event.target.files[0];
    this.setState(obj);
  };

  handleChangeDate = (event, name) => {
    var obj = {};
    obj[name] = event;
    this.setState(obj);
  };

  onSelectFileHandler = (e) => {
    this.state.file = e[0];
  };

  setLoading = (val) => {
    this.setState({ isLoading: val });
  };

  setCourses = (val) => {
    this.setState({ courses: val });
  };

  setTypes = (val) => {
    this.setState({ types: val });
  };

  setRules = (val) => {
    this.setState({ rules: val });
  };

  setStudents = (val) => {
    this.setState({ students: val });
  };

  setStudentsInGroup = (val) => {
    this.setState({
      students_in_group: [
        ...this.state.students_in_group,
        ...val.map((i) => i.id),
      ],
    });
  };

  createTask = () => {
    const data = new FormData();
    data.append("params", this.state.file);
    data.append("rule", this.state.rule);
    data.append("deadline", this.state.deadline);
    data.append("task_type", this.state.task_type);
    data.append("students_in_group", this.state.students_in_group);
    data.append("name", this.state.name);
    data.append("user_id", sessionStorage.getItem("user_id"));
    axios
      .post("http://127.0.0.1:8000/create_task/", data, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        this.setState({ isLoading: false });
        this.setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    axios
      .get("http://127.0.0.1:8000/get_initial_data_for_create_task/")
      .then((response) => {
        this.setStudents(response.data.students);
        this.setRules(response.data.rules);
        this.setTypes(response.data.task_type);
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return <div> Loading ... </div>;
    }

    return (
      <div>
        <fieldset>
          <legend>Создание задания</legend>

          <FormControl style={{ width: "45%" }}>
            <TextField
              id="outlined-number"
              variant="outlined"
              label="Наименование"
              onChange={(e) => this.handleChange(e, "name")}
            />
          </FormControl>

          <FormControl style={{ width: "50%", marginLeft: "3%" }}>
            <InputLabel id="demo-simple-select-label">Тип задания</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              variant="outlined"
              onChange={(e) => this.handleChange(e, "task_type")}
            >
              {this.state.types.map((i) => (
                <MenuItem value={i.id}>{i.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth={true}>
            <InputLabel id="demo-simple-select-label">
              Список студентов
            </InputLabel>
            <TransferList
              students={this.state.students}
              setStudent={this.setStudentsInGroup}
            />
          </FormControl>

          <FormControl fullWidth={true}>
            <InputLabel id="demo-simple-select-label">
              Правило оформления
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(e) => this.handleChange(e, "rule")}
            >
              {this.state.rules.map((i) => (
                <MenuItem value={i.id}>
                  {i.font.name} {i.font.size} {i.font.name}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: "50%", marginTop: "2%"}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Крайний срок сдачи"
                  format="dd/MM/yyyy"
                  value={new Date()}
                  variant="outlined"

                  onChange={(e) => this.handleChangeDate(e, "deadline")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </FormControl>

          <FormControl style={{marginTop: "2%"}}
>
            <InputLabel htmlFor="example">
              Пример работы
            </InputLabel>
            <Input
              id='example'
              type="file"
              onChange={(e) => this.handleChangeFile(e, "file")}
              variant="outlined"
              label='Пример'
            />
          </FormControl>
        </fieldset>

        <Button
          variant="contained"
          color="primary"
          component="span"
          type="submit"
          onClick={this.createTask}
          style={{ marginLeft: "40%", marginTop: "5%" }}
        >
          Отправить
        </Button>
      </div>
    );
  }
}

export default CreateTask;
