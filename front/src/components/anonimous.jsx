import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import StyleSelect from "./styleSelector";
import FileLoader from "./fileloader";

import axios from "axios";

import SinglePage from "./singlePage";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";


var styles = {};
var file = null;
var pdf = null;
var docx = null;

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
  return ["Задайте оформление", "Загрузите файл", "Результат"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Выберите задание...";
    case 1:
      return "";
    default:
      return "Unknown step";
  }
}

var recId = null;

var handleChange = (e) => {
  recId = e.target.value;
};



function GetStepContentHTML(step, data, setLoading, setError) {
  switch (step) {
    case 0:
      return <StyleSelect styles={styles} />;
    case 1:
      return <Input type="file" style={{ marginTop: "5%", marginLeft: "45%" }} onChange={(e) => (file = e.target.files[0])} />;
    case 2:
      const resp_data = new FormData();
      var link = document.createElement("a");

      resp_data.append("params", file);
      resp_data.append("styles", JSON.stringify(styles));

      if (!pdf) {
        setLoading(true);

        axios.post("http://127.0.0.1:8000/check_file_anonimous/", resp_data)
          
        .then((response) => {
            setLoading(false);
            pdf = response.data.result_pdf;
            docx = response.data.result_docx;
            console.log(pdf);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
      }

      return pdf ? <SinglePage pdf={`http://127.0.0.1:8000${pdf}`} docx={`http://127.0.0.1:8000${docx}`}/> : null;

    default:
      return "Unknown step";
  }
}

export default function ShowExamples() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await axios.get("http://127.0.0.1:8000/tasks/");
      setCourses(coursesData.data);
      setLoading(false);
    };
    fetchData();
  }, []);
  if (isLoading && !isError) {
    return <div style={{ marginTop: "20%", marginLeft: "50%" }}>
    <CircularProgress />{" "}
  </div>
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
      <div style={{ margin: "auto" }}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Проверка окончена. Повторить?
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Сброс
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            {GetStepContentHTML(activeStep, courses, setLoading, setError)}
            <div align="center" style={{ marginTop: "5%" }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Назад
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Пропустить
                </Button>
              )}

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