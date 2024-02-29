import { View, ViewStyle, StyleSheet } from 'react-native'
import { ComponentProps } from 'react'
import { Input as GlueInput, InputSlot, InputIcon } from "@gluestack-ui/themed"

type GlueInputProps = ComponentProps<typeof GlueInput>;

interface InputProps extends GlueInputProps {
  style?: ViewStyle;
  icon?: any;
}

export const Input = (props: InputProps) => {
  // deconstruct props to remove style and children but keep the rest in a variable called rest
  const { style, children, icon, ...rest } = props;

  return (
    <View style={styles.input}>
      <GlueInput style={[styles.input, style]} {...rest}>
        {icon && (
          <InputSlot pl="$3" pr="$3">
            <InputIcon as={icon} />
          </InputSlot>
        )}
        {children}
      </GlueInput>
    </View>
  )
};

const styles = StyleSheet.create({
  input: {
    color: '#919191',
    borderColor:'#919191',
    borderRadius: 44,
    borderWidth: 1,
    borderStyle: 'solid',
    overflow: 'hidden',
  },
});
