import React from 'react';
import { ViewProps } from 'react-native';
import {
  FormControlError as GlueFormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  AlertCircleIcon,
} from '@gluestack-ui/themed';

interface FormControlErrorProps extends ViewProps {
  text: React.ReactNode;
}

export const FormControlError = (props: FormControlErrorProps) => {
  const { text, ...rest } = props;
  return (
    <GlueFormControlError {...rest}>
      <FormControlErrorIcon as={AlertCircleIcon} />
      <FormControlErrorText>
        {text}
      </FormControlErrorText>
    </GlueFormControlError>
  );
};
