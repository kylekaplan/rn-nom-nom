import { TextInput as RNTextInput, ViewStyle, StyleSheet } from 'react-native'
import { ComponentProps } from 'react'

type GlueTextInputProps = ComponentProps<typeof RNTextInput>;

interface TextInputProps extends GlueTextInputProps {
  style?: ViewStyle;
}

export const TextInput = (props: TextInputProps) => {
  // deconstruct props to remove style but keep the rest in a variable called rest
  const { style, ...rest } = props;
  return (
    <RNTextInput
      style={[styles.textInput, style]}
      placeholderTextColor='#919191'
      {...rest}
    />
  )
};

// create stylesheet
const styles = StyleSheet.create({
  textInput: {
    width: '100%',
  },
});
