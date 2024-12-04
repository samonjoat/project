import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Upload Master File', 'Upload Salesforce Files', 'Map Columns', 'Process', 'Download Results'];

interface StepsProps {
  activeStep: number;
}

export const Steps: React.FC<StepsProps> = ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};