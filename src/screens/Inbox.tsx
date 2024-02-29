import { View, StyleSheet } from "react-native";
import { Text } from "@gluestack-ui/themed";

export const Inbox = () => {
  return (
    <View style={styles.container}>
      <Text>Inbox!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
});
