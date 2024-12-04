import React from 'react';
import { Box, Button } from '@mui/material';

interface NavigationButtonsProps {
  activeStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={activeStep === 0}
      >
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        disabled={isNextDisabled || activeStep === totalSteps - 1}
      >
        {activeStep === totalSteps - 2 ? 'Process' : 'Next'}
      </Button>
    </Box>
  );
};