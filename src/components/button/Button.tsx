import { StyleSheet, ViewStyle } from 'react-native'
import { ComponentProps } from 'react'
import { Button as GlueButton } from "@gluestack-ui/themed"

type GlueButtonProps = ComponentProps<typeof GlueButton>;

interface ButtonProps extends GlueButtonProps {
  style?: ViewStyle;
}

export const Button = (props: ButtonProps) => {
  // deconstruct props to remove style and children but keep the rest in a variable called rest
  const { style, children, ...rest } = props;

  return (
    <GlueButton
      size="md"
      variant="solid"
      action="primary"
      style={[styles.button, style]}
      {...rest}
    >
      {children}
    </GlueButton>
  )
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 44,
    width: '100%',
    backgroundColor: '#000000',
    height: 50,
    color: '#ffffff',
  },
});