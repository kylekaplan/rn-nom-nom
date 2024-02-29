import 'react-native-get-random-values';
import '@ethersproject/shims';

import { useEffect, useState } from 'react';
import { TextInput, Image, StyleSheet, ActivityIndicator } from 'react-native';
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
import { createSmartAccountClient } from "@biconomy/account";
import ABI from './abi.json';
import { ChainId } from "@biconomy/core-types";
import { LogBox } from "react-native";
import { PrivyProvider } from './privy-provider';
import Login from './src/screens/Login';
import { config } from '@gluestack-ui/config';
import { Home } from './src/screens/Home';

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

  async function send() {
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

      let _toAddress:any = toAddress
      if (_toAddress.includes('.eth')) {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(),
        })
        const ensAddress = await publicClient.getEnsAddress({
          name: normalize(_toAddress), 
        })
        if (ensAddress) {
          _toAddress = ensAddress
        }
      }
      if (_toAddress.includes('.lens') || _toAddress.includes('lens/')) {
        const response = await fetch('https://api.airstack.xyz/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.EXPO_PUBLIC_AIRSTACK_KEY || '', // Include this if your API request requires authentication
          },
          body: JSON.stringify(graphqlQuery(_toAddress))
        }).then(res => res.json())
        console.log('response: ', response) 
        if (response.data && response.data.Socials) {
          _toAddress = response.data.Socials.Social[response.data.Socials.Social.length - 1].userAssociatedAddresses[0]
        }
      }
      console.log('toAddress: ', _toAddress)

      // const hash = await client.sendTransaction({
      //   account: ownerAddress as `0x${string}`,
      //   to: _toAddress,
      //   value: parseEther(amount.toString())
      // })
      // console.log('hash: ', hash)
      // setAmount(0)
      // setToAddress('')
      // toast.show({
      //   placement: "top",
      //   render: ({ id }) => {
      //     const toastId = "toast-" + id
      //     return (
      //       <Toast
      //       nativeID={toastId}
      //       action="attention"
      //       variant="solid">
      //         <VStack space="xs">
      //           <ToastTitle>Congratulations</ToastTitle>
      //           <ToastDescription>
      //            {`Transaction sent to ${_toAddress} successfully!`}
      //           </ToastDescription>
      //         </VStack>
      //       </Toast>
      //     )
      //   },
      // })
      // setSending(false)

      const smartAccount = await createSmartAccountClient({
        signer: client as any,
        bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL || '',
        biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_KEY,
        chainId: ChainId.BASE_MAINNET
      })
      const address = await smartAccount.getAccountAddress()
      console.log('smart account address: ', address)
      const _amount = (amount / 1000)
      
      const encodedCall = encodeFunctionData({
        abi: ABI,
        functionName: "transfer",
        args: [_toAddress, parseGwei(_amount.toString())],
      })

      const transactionResponse = await smartAccount.sendTransaction({
        // USDC on Base contract
        to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        data: encodedCall,
      });

      const { transactionHash } = await transactionResponse.waitForTxHash()
      console.log('transactionHash: ', transactionHash)

      setAmount(0)
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id
          return (
            <Toast
            nativeID={toastId}
            action="attention"
            variant="solid">
              <VStack space="xs">
                <ToastTitle>Congratulations</ToastTitle>
                <ToastDescription>
                 {`Payment sent to ${toAddress} successfully!`}
                </ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })
      setSending(false)
      setToAddress('')
    } catch (err) {
      console.log('error: ', err)
      setSending(false)
    }
  }

  function renderUserView() {
    return null;
    // return (
    //   <View style={{
    //     justifyContent: 'center',
    //     flex: 1
    //   }}>
    //     <Text style={styles.welcomeText}>Welcome, {user?.linked_accounts[0].name}</Text>
    //     <View>
    //       <TextInput
    //         onChangeText={setAmount}
    //         placeholder="$0"
    //         placeholderTextColor={'rgba(0, 0, 0, .6)'}
    //         value={amount ? amount.toString() : null}
    //         style={styles.inputAmount}
    //       />
    //       <Input
    //         style={styles.recipientInput}
    //         variant="outline"
    //         size="md"
    //       >
    //         <InputField
    //           onChangeText={setToAddress}
    //           placeholder="Recipient"
    //           placeholderTextColor={'rgba(0, 0, 0, .6)'}
    //           value={toAddress}
    //           autoCapitalize="none"
    //           autoCorrect={false}
    //           style={styles.recipientInputField}
    //         />
    //       </Input>
    //       <Button
    //         style={styles.sendButton}
    //         onPress={() => send()}
    //       >
    //         {
    //           !sending && (
    //             <Ionicons name="caret-forward-outline" size={22} color="white" />
    //           )
    //         }
    //         {
    //           sending && (
    //             <ActivityIndicator size="small" color="white" />
    //           )
    //         }
    //         <ButtonText style={{marginLeft: 10, fontSize: 18}}>Send</ButtonText>
    //       </Button>
    //     </View>
    //     <Button
    //       action="secondary"
    //       style={styles.logoutButton}
    //       onPress={() => logout()}
    //     >
    //       <Ionicons name="log-out" size={22} color="white" />
    //       <ButtonText style={{fontSize: 18, marginLeft: 10}}>Logout</ButtonText>
    //     </Button>
    //   </View>
    // )
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
          <Home />
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
    <App />
    </PrivyProvider>
  </GluestackUIProvider>
  )
}