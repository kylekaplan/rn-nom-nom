import { StyleSheet } from 'react-native';
import { Button, ButtonText, View } from '@gluestack-ui/themed';
import { usePrivy } from '@privy-io/expo';
import Ionicons from '@expo/vector-icons/Ionicons';

export const Profile = () => {
  const { logout } = usePrivy() as any;
  return (
    <View style={styles.container}>
      <Button
        action="secondary"
        style={styles.logoutButton}
        onPress={() => logout()}
      >
        <Ionicons name="log-out" size={22} color="white" />
        <ButtonText style={{fontSize: 18, marginLeft: 10}}>Logout</ButtonText>
      </Button>
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
  logoutButton: {
    borderRadius: 44,
    width: 300,
    marginTop: 10,
    height: 50,
  },
});
