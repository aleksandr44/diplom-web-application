import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";

import axios from "axios";
import SinglePage from "./singlePage";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from '@material-ui/lab/Alert';



const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Выберите задание", "Загрузите файл", "Результат проверки"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Выберите задание...";
    case 1:
      return "Загрузите файл";
    case 2:
      return "Результат проверки";
    default:
      return "Unknown step";
  }
}
var recId = null;
var file = null;
var taskId = null;

const handleChange = (event) => {
  recId = event.target.value;
};

function getStepContentHTML(step, data, setLoading, setError) {
  switch (step) {
    case 0:
      return (
        <FormControl fullWidth={true}>
          <Select id="demo-simple-select" onChange={handleChange}>
            {data?.map((i) => (
              <MenuItem value={i.id}>{i.text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case 1:
      return <Input type="file" style={{ marginTop: "2%", marginLeft: "6%" }} onChange={(e) => (file = e.target.files[0])} />;
    case 2:
      const resp_data = new FormData();
      var link = document.createElement("a");

      resp_data.append("params", file);
      resp_data.append("task_id", recId);

      if (!pdf) {
        setLoading(true);

        axios
          .post("http://127.0.0.1:8000/recognize_file/", resp_data)
          .then((response) => {
            setLoading(false);
            pdf = response.data.result_pdf;
            docx = response.data.result_docx;
            console.log(pdf);
          })
          .catch(function (error) {
            setLoading(false)
            // setError(true)
            console.log(error);
          });
      }

      return pdf ? <SinglePage docx={`http://127.0.0.1:8000${docx}`}  pdf={`http://127.0.0.1:8000${pdf}`} /> : null;

    default:
      return "Unknown step";
  }
}

var pdf = null;
var docx = null;

export default function Loader() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleReset = () => {
    setActiveStep(0);
    pdf = null;
  };

  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await axios.get("http://127.0.0.1:8000/tasks/");
      setCourses(coursesData.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ marginTop: "20%", marginLeft: "50%" }}>
        {" "}
        <CircularProgress />{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: "20%", marginLeft: "50%" }}>
       <Alert severity="error">Что-то пошло не так! Попробуйте снова.</Alert>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div align="center" style={{ marginTop: "5%" }}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Проверка окончена. Повторить?
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Заново
            </Button>
          </div>
        ) : (
          <div align="center" style={{ marginTop: "1%" }}>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            {getStepContentHTML(activeStep, courses, setLoading, setError)}
            <div align="center" style={{ marginTop: "5%" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Выход" : "Далее"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
