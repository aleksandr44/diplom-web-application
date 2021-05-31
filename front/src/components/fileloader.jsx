import React from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";



class FileLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      has_errors: null,
      errors: null,
      value: 0
    };
  }


  onSelectImageHandler = (e) => {
    this.state.file = e[0];
  };

  setErrorStatus = (message) => {
      if (message) {
        this.state.has_errors = message.message.has_error
        if (this.state.has_errors){
          this.state.errors = message.message
          this.forceUpdate()
        }
      }
  };

  sendFile = (e) => {
    const data = new FormData();
    data.append("params", this.state.file);
    axios
      .post("http://127.0.0.1:8000/recognize_file/", data, {responseType:'blob'})
      .then((response) => {
      var headers = response.headers;
     var blob = new Blob([response.data],{type:headers['content-type']});
     var link = document.createElement('a');
     link.href = window.URL.createObjectURL(response.data);
     link.download = "Your_file_name.docx";
     link.click();
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  handleChange = (event, newValue) => {
    this.setState({value: newValue})
  };


  render() {
    return (
      <form>
          <InputLabel htmlFor="standard-adornment-password">
            Выберите файл
          </InputLabel>
          <Input
            type="file"
            onChange={(e) => this.onSelectImageHandler(e.target.files)}
          />
         {!this.props.hideSendButton && <Button
            onClick={() => {
              this.sendFile();
            }}
            variant="contained"
            color="primary"
            component="span"
            type="submit"
            style={{marginLeft: '5%', marginTop: '-2%'}}
            download
          >
            Загрузить{" "}
          </Button>
  }
        </form>
    );
  }
}

export default FileLoader;
