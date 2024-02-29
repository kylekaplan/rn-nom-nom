import { Image, StyleSheet, View, ActivityIndicator } from 'react-native'
import {
  FormControl,
  MailIcon,
  ButtonText,
} from '@gluestack-ui/themed'
import { useLoginWithEmail } from '@privy-io/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '../components/button/Button';
import { Input } from '../components/input/Input';
import { TextInput } from '../components/input/TextInput';
import { Logo } from '../components/logo/Logo';

const logo = require('../../assets/logo.webp');

function Login() {
  const {sendCode} = useLoginWithEmail()
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.formView}>
        <FormControl>
          <Input icon={MailIcon}>
            <TextInput placeholder="your@email.com" />
          </Input>
          <Button
            onPress={() => sendCode({
              email: 'kylekaplan50@gmail.com'
            })}
            style={{ marginTop: 20 }}
          >
            <ButtonText>Sign in with email</ButtonText>
          </Button>
        </FormControl>
      </View>
    </View>
  )
};

export default Login;

const styles = StyleSheet.create({
  formView: {
    marginTop: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});