import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';


import axios from "axios";


import SinglePage from './singlePage'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  return ['Выберите задание', 'Образец'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Выберите задание...';
    case 1:
      return '';
    default:
      return 'Unknown step';
  }
}

var recId = null

var handleChange = (e) => {
  recId = e.target.value
}


function GetStepContentHTML(step, data) {
    switch (step) {
      case 0:
        return  <FormControl fullWidth={true}>
        <Select
          id="demo-simple-select"
          onChange={handleChange}
        >
            {data?.map(i => <MenuItem value={i.id}>{i.text}</MenuItem>)}
        </Select>
      </FormControl>;
      case 1:
        let pdf_file = data.find(i => i.id == recId).example_pdf
        return <SinglePage pdf={pdf_file}/>
      default:
        return 'Unknown step';
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

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await axios.get('http://127.0.0.1:8000/tasks/')
      setCourses(coursesData.data)
      setLoading(false);
    }
    fetchData()
  }, [])
  if(isLoading) { return <div> Loading ... </div> };
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
      <div  style={{margin: 'auto'}}>
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
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            {GetStepContentHTML(activeStep, courses)}
            <div align='center' style={{marginTop:'5%'}}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
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
                {activeStep === steps.length - 1 ? 'Выход' : 'Далее'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


 