import { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native';
import {
  FormControl,
  MailIcon,
  ButtonText,
  Text,
  VStack,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  ButtonSpinner,
} from '@gluestack-ui/themed'
import { useLoginWithEmail } from '@privy-io/expo';
import { OtpInput } from "react-native-otp-entry";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '../components/button/Button';
import { Input } from '../components/input/Input';
import { TextInput } from '../components/input/TextInput';
import { Logo } from '../components/logo/Logo';
import { FormControlError } from '../components/form/FormControlError';

const logo = require('../../assets/logo.webp');

function Login() {
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  
  const { state, sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess({email}) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id
          return (
            <Toast nativeID={toastId} action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>A confirmation code has been sent to {email}.</ToastTitle>
                {/* <ToastDescription>
                  Hey, just wanted to touch base and see how you're doing.
                  Let's catch up soon!
                </ToastDescription> */}
              </VStack>
            </Toast>
          )
        },
      });
    },
    onLoginSuccess(user) {
      // show a toast, send analytics event, etc...
      console.log('user', user);
    },
    onError(error) {
      // TOOD: handle error
      // show a toast, update form errors, etc...
      console.log('error', error);
    },
  });
  const { status: loginWithEmailStatus } = state;
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleSignInWithEmail = () => {
    if (!validateEmail(email)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      sendCode({
        email,
      });
    }
  };

  const handleOtpFilled = (code: string) => {
    loginWithCode({
      code,
    });
  };

  if (
    loginWithEmailStatus === 'initial'
    || loginWithEmailStatus === 'error'
    || loginWithEmailStatus === 'sending-code'
  ) {
    return (
      <View style={styles.container}>
        <Logo />
        <View style={styles.formView}>
          <FormControl isInvalid={isInvalid}>
            <Input icon={MailIcon}>
              <TextInput
                placeholder="your@email.com"
                onChangeText={handleEmailChange}
              />
            </Input>
            <FormControlError text="Must be a valid email." />
            <Button
              onPress={handleSignInWithEmail}
              style={{ marginTop: 20 }}
              loading={loginWithEmailStatus === 'sending-code'}
            >
              <ButtonText>Sign in with email</ButtonText>
            </Button>
          </FormControl>
        </View>
      </View>
    );
  }

  if (
    loginWithEmailStatus === 'awaiting-code-input'
    || loginWithEmailStatus === 'submitting-code'
    || loginWithEmailStatus === 'done'
  ) {
    return (
      <SafeAreaView style={styles.otpContainer}>
        {/* back button icon */}
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          alignSelf='flex-start'
          // onPress={() => {
          //   // todo: go back to the previous screen
          // }
        />
        <VStack space="xl" alignItems='center' style={styles.vStack}>
          <Ionicons
            name="mail-outline"
            size={164}
            color="black"
          />
          <Text size='xl' bold style={[styles.textAlignCenter]}>
            Enter confirmation code
          </Text>
          <Text style={[styles.textAlignCenter]}>
            Please check {email} for an email from privy.io and enter your code below.
          </Text>
          <OtpInput
            numberOfDigits={6}
            focusColor="black"
            focusStickBlinkingDuration={500}
            // onTextChange={(text) => console.log(text)}
            onFilled={(text) => handleOtpFilled(text)}
          />
          {loginWithEmailStatus === 'submitting-code' && (
            <ActivityIndicator color="#0000ff" />
          )}
          <View>
            <Button
              size="sm"
              variant="link"
            >
              <ButtonText>Resend Code</ButtonText>
            </Button>
          </View>
        </VStack>
      </SafeAreaView>
    );
  }

  return <Text>Something went wrong. Unknown state.</Text>;

};

export default Login;

const styles = StyleSheet.create({
  textAlignCenter: {
    textAlign: 'center',
  },
  vStack: {
    marginTop: 150,
  },
  otpContainer: {
    flex: 1,
    alignItems: 'center',
    width: '80%',
  
  },
  formView: {
    marginTop: 30,
    width: '80%',
    maxWidth: 350,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});