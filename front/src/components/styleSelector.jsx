import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import Autocomplete from "@material-ui/lab/Autocomplete";

const My = [
  { title: "Abadi MT Condensed Light" },
  { title: "Albertus Extra Bold" },
  { title: "Albertus Medium" },
  { title: "Antique Olive" },
  { title: "Arial" },
  { title: "Arial Black" },
  { title: "Arial MT" },
  { title: "Arial Narrow" },
  { title: "Bazooka" },
  { title: "Book Antiqua" },
  { title: "Bookman Old Style" },
  { title: "Boulder" },
  { title: "Calisto MT" },
  { title: "Calligrapher" },
  { title: "Century Gothic" },
  { title: "Century Schoolbook" },
  { title: "Cezanne" },
  { title: "CG Omega" },
  { title: "CG Times" },
  { title: "Charlesworth" },
  { title: "Chaucer" },
  { title: "Clarendon Condensed" },
  { title: "Comic Sans MS" },
  { title: "Copperplate Gothic Bold" },
  { title: "Copperplate Gothic Light" },
  { title: "Cornerstone" },
  { title: "Coronet" },
  { title: "Courier" },
  { title: "Courier New" },
  { title: "Cuckoo" },
  { title: "Dauphin" },
  { title: "Denmark" },
  { title: "Fransiscan" },
  { title: "Garamond" },
  { title: "Geneva" },
  { title: "Haettenschweiler" },
  { title: "Heather" },
  { title: "Helvetica" },
  { title: "Herald" },
  { title: "Impact" },
  { title: "Jester" },
  { title: "Letter Gothic" },
  { title: "Lithograph" },
  { title: "Lithograph Light" },
  { title: "Long Island" },
  { title: "Lucida Console" },
  { title: "Lucida Handwriting" },
  { title: "Lucida Sans" },
  { title: "Lucida Sans Unicode" },
  { title: "Marigold" },
  { title: "Market" },
  { title: "Matisse ITC" },
  { title: "MS LineDraw" },
  { title: "News GothicMT" },
  { title: "OCR A Extended" },
  { title: "Old Century" },
  { title: "Pegasus" },
  { title: "Pickwick" },
  { title: "Poster" },
  { title: "Pythagoras" },
  { title: "Sceptre" },
  { title: "Sherwood" },
  { title: "Signboard" },
  { title: "Socket" },
  { title: "Steamer" },
  { title: "Storybook" },
  { title: "Subway" },
  { title: "Tahoma" },
  { title: "Technical" },
  { title: "Teletype" },
  { title: "Tempus Sans ITC" },
  { title: "Times" },
  { title: "Times New Roman" },
  { title: "Times New Roman PS" },
  { title: "Trebuchet MS" },
  { title: "Tristan" },
  { title: "Tubular" },
  { title: "Unicorn" },
  { title: "Univers" },
  { title: "Univers Condensed" },
  { title: "Vagabond" },
  { title: "Verdana" },
  { title: "Westminster" },
];

const typesFont = [
  { key: "b", value: "Жирный" },
  { key: "i", value: "Курсив" },
  { key: "st", value: "Обычный" },
  { key: "bi", value: "Полужирный курсив" },
];

class StyleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      isLoading: true,
      password: null,
      fontName: null,
      fontSize: null,
      fontType: null,
      spaces: null,
      firstSpace: null,
      interval: null,
      fields: null,
      aligment: null,
      line_spacing: null,
      left_indent: null,
      right_indent: null,
      first_line_indent: null,
    };
  }

  handleChange = (event, name) => {
    debugger
    var obj = {};
    obj[name] = event.target.value;
    if (this.props?.styles){
      this.props.styles[name] = event.target.value;
    }
    
    this.setState(obj);
  };

  setLoading = (val) => {
    this.setState({ isLoading: val });
  };

  setCourses = (val) => {
    this.setState({ courses: val });
  };

  createStyle = () => {
    axios
      .post("http://127.0.0.1:8000/create_style/", {styles: {
        fontName: this.state.fontName,
        fontSize: this.state.fontSize,
        fontType: this.state.fontType,
        spaces: this.state.spaces,
        firstSpace: this.state.firstSpace,
        line_spacing: this.state.line_spacing,
        fields: this.state.fields,
        aligment: this.state.aligment,
        left_indent: this.state.left_indent,
        right_indent: this.state.right_indent,
        first_line_indent: this.state.first_line_indent,
        user_id: sessionStorage.getItem("user_id")}
      })
      .then((response) => {
        this.setState({ isLoading: false });
        this.setCourses(response.data);
        this.componentWillReceivePropssetLoading(false);
      })
      .catch((error) => {
        this.setState({ isLoading: false })
        console.log(error);
      });
  };

  componentDidMount() {
    axios
      .get("http://127.0.0.1:8000/get_initial_data/")
      .then((response) => {
        this.setState({ isLoading: false });
        this.setCourses(response.data);
        this.componentWillReceivePropssetLoading(false);
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
          <legend>Шрифт</legend>
          <FormControl style={{width: "50%"}}>
          <Autocomplete
            id="combo-box-demo"
            options={My}
            getOptionLabel={(option) => option.title}
            style={{width: "100%"}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Наименование"
                variant="outlined"
                onSelect={(e) => this.handleChange(e, "fontName")}
              />
            )}
          />
          </FormControl>

          <FormControl  style={{width: "50%"}}>
            <InputLabel id="demo-simple-select-label">Тип шрифта</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              variant="outlined"
              style={{width: "100%"}}
              onChange={(e) => this.handleChange(e, "fontType")}
            >
              {typesFont.map((i) => (
                <MenuItem value={i.key}>{i.value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>

          <FormControl fullWidth={true}>
            <TextField
              id="outlined-number"
              type="number"
              variant="outlined"
              label='Размер шрифта'
              onChange={(e) => this.handleChange(e, "fontSize")}
            />
          </FormControl>
        </fieldset>

        <fieldset>
          <legend>Абзац</legend>

          <FormControl style={{width: "50%"}}>
            <InputLabel id="demo-simple-select-label"> Выравнивание</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(e) => this.handleChange(e, "aligment")}
            >
              <MenuItem value={"LEFT"}>По левому краю</MenuItem>
              <MenuItem value={"RIGHT"}>По правому краю</MenuItem>
              <MenuItem value={"CENTER"}>По центру</MenuItem>
              <MenuItem value={"JUSTIFY"}>По ширине</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{width: "50%"}}>
            <InputLabel id="demo-simple-select-label">
              {" "}
              Межстрочный интервал
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label='Межстрочный интервал'
              onChange={(e) => this.handleChange(e, "line_spacing")}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={1.5}>1.5</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{width: "50%"}}>
            <TextField
              id="outlined-number"
              type="number"
              variant="outlined"
              label='Слева'
              onChange={(e) => this.handleChange(e, "left_indent")}
            />
          </FormControl>

          <FormControl style={{width: "50%"}}>
            <TextField
              id="outlined-number"
              type="number"
              variant="outlined"
              label='Справа'
              onChange={(e) => this.handleChange(e, "right_indent")}
            />
          </FormControl>

          <FormControl fullWidth={true}>
            
            <TextField
              id="outlined-number"
              type="number"
              variant="outlined"
              label='Отступ первой строки'
              onChange={(e) => this.handleChange(e, "first_line_indent")}
            />
          </FormControl>
        </fieldset>

        <FormControl fullWidth={true}>
          <InputLabel id="demo-simple-select-label">Поля</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            //   value={age}
            onChange={(e) => this.handleChange(e, "fields")}
          >
            {this.state.courses.map((i) => (
              <MenuItem value={i.id}>
                {i.name} (Верх: {i.top}; Низ: {i.bottom}; Левое: {i.left};
                Правое: {i.right};)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!this.props?.styles && <Button
          variant="contained"
          color="primary"
          component="span"
          type="submit"
          onClick={this.createStyle}
           style={{marginLeft: '50%', marginTop: '5%'}}
        >
          Отправить
        </Button>
  }
      </div>
    );
  }
}

export default StyleSelect;
