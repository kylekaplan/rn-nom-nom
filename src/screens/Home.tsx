import { useState } from 'react';
import { TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
} from '@gluestack-ui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePrivy } from '@privy-io/expo';
import { ProductCard } from '../components/card/ProductCard';

export const Home = () => {
  const {isReady, user, logout} = usePrivy() as any;
  const [amount, setAmount] = useState<any>(0);
  const [toAddress, setToAddress] = useState('');
  const [sending, setSending] = useState(false);
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%',
    }}>
      <Text style={styles.welcomeText}>Welcome, {user?.linked_accounts[0].name}</Text>
      <View>
        <ProductCard />
      </View>
      <Button
        action="secondary"
        style={styles.logoutButton}
        onPress={() => logout()}
      >
        <Ionicons name="log-out" size={22} color="white" />
        <ButtonText style={{fontSize: 18, marginLeft: 10}}>Logout</ButtonText>
      </Button>
    </View>
  )
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  inputAmount: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 110,
    color: 'rgba(255, 255, 255, .8)'
  },
  recipientInput: {
    marginTop: 20,
    borderWidth: 0,
  },
  sendButton: {
    backgroundColor: '#000',
    borderRadius: 44,
    marginTop: 20,
    width: 300,
    height: 50,
  },
  recipientInputField: {
    textAlign: 'center',
    fontSize: 28, color: 'rgba(255, 255, 255, .8)'
  },
  logoutButton: {
    borderRadius: 44,
    width: 300,
    marginTop: 10,
    height: 50,
  },
});
