import 'react-native-get-random-values';
import '@ethersproject/shims';

import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ActivityIndicator, View } from 'react-native';
import {
  Button,
  ButtonText,
  Input,
  InputField,
  useToast,
  VStack,
  Toast,
  ToastTitle,
  ToastDescription,
  GluestackUIProvider,
} from '@gluestack-ui/themed';
import {
  useEmbeddedWallet,
  isNotCreated,
  usePrivy,
  useLoginWithEmail,
  useLoginWithOAuth,
} from '@privy-io/expo';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  encodeFunctionData, createWalletClient, createPublicClient, http, custom, parseEther, parseGwei
} from 'viem';
import { base, mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { BiconomySmartAccountV2, createSmartAccountClient } from "@biconomy/account";
// import ABI from './abi.json';
import { ChainId } from "@biconomy/core-types";
import { LogBox } from "react-native";
import { PrivyProvider } from './privy-provider';
import Login from './src/screens/Login';
import { config } from '@gluestack-ui/config';
import { Home } from './src/screens/Home';
import { MainTabs } from './src/components/tabs/Tabs';
import { XmtpProvider } from 'xmtp-react-native-sdk';

LogBox.ignoreLogs(['Possible unhandled promise rejection']);

const graphqlQuery = handle => ({
  query: `
    query GetAddressesOfLens(
      $profile: Identity!
    ) {
      Socials(
        input: {
          filter: {
            identity: { _in: [$profile] }
            dappName: { _eq: lens }
          }
          blockchain: ethereum
        }
      ) {
        Social {
          profileName
          profileTokenId
          profileTokenIdHex
          userAssociatedAddresses
        }
      }
    }
    `,
    variables: {
      profile: handle
    }
  }
)


function App() {
  const {isReady, user, logout} = usePrivy() as any;
  const wallet = useEmbeddedWallet()
  const toast = useToast()
  const [amount, setAmount] = useState<any>(0)
  const [ownerAddress, setOwnerAddress] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [sending, setSending] = useState(false)
  const hasWallet = !isNotCreated(wallet)
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);

  console.log('ownerAddress: ', ownerAddress)

  useEffect(() => {
    checkWallet()
  }, [wallet])

  if (!isReady) return <ActivityIndicator />

  async function checkWallet() {
    try {
      if (!wallet || wallet.status !== 'connected') return
      await wallet.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '8453'}]
      })
      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts'
      })
      setOwnerAddress(accounts[0])
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async function getSmartWallet() {
    if (smartAccount) return;
    try {
      if (!wallet || wallet.status !== 'connected') return
      setSending(true)
      const client = createWalletClient({
        account: ownerAddress as `0x${string}`,
        chain: base,
        transport: custom({
          async request({ method, params }) {
            return await wallet.provider?.request({ method, params })
          }
        })
      })

      // const smartAccount = await createSmartAccountClient({
      //   signer: client as any,
      //   bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL || '',
      //   biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_KEY,
      //   chainId: ChainId.BASE_MAINNET
      // })
      // setSmartAccount(client);
      // const address = await smartAccount.getAccountAddress()
      // console.log('smart account address: ', address)
    } catch (err) {
      console.log('error: ', err)
      setSending(false)
    }
  }


  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      style={styles.container}
    >
      {
        !hasWallet && user && (
          <>
            <Button
            style={{width: 250}}
            onPress={() => wallet.create()}
            >
              <Ionicons name="wallet-outline" size={16} color="white" />
              <ButtonText style={styles.createWalletButtonText}>Create Wallet</ButtonText>
            </Button>
          </>
        )
      }
      {
        hasWallet && user && (
          <View style={{ flex: 1, width: '100%' }}>
            <MainTabs smartAccount={smartAccount} />
          </View>
        )
      }
      {
       !user && (
          <Login />
        )
      }
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  createWalletButtonText: {marginLeft: 10},
});

export default function Main() {
  return (
    <GluestackUIProvider config={config}>
      <PrivyProvider>
        <NavigationContainer>
          <XmtpProvider>
            <App />
          </XmtpProvider>
        </NavigationContainer>
      </PrivyProvider>
    </GluestackUIProvider>
  )
}