import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { ButtonText, Text } from "@gluestack-ui/themed";
import { Client } from '@xmtp/react-native-sdk';
import { isNotCreated, useEmbeddedWallet, usePrivy } from "@privy-io/expo";
import {
  encodeFunctionData, createWalletClient, createPublicClient, http, custom,
} from 'viem';
import { base, mainnet } from 'viem/chains';
import { ChainId } from "@biconomy/core-types";
import { Button } from "../components/button/Button";
import { createSmartAccountClient } from "@biconomy/account";

export const Inbox = () => {
  const { isReady } = usePrivy() as any;
  const [ ownerAddress, setOwnerAddress ] = useState<string>();
  const [ signer, setSigner ] = useState<any>();
  const [ xmtp, setXmtp ] = useState<any>();
  const [ conversation, setConversation ] = useState<any>();
  const [ messages, setMessages ] = useState<any>();
  
  const wallet = useEmbeddedWallet();
  const hasWallet = !isNotCreated(wallet);

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
  
  useEffect(() => {
    setUpClient();
  }, []);

  const setUpClient = async () => {
    // Create the client with your wallet. This will connect to the XMTP development network by default
    if (!wallet || wallet.status !== 'connected') return
    const client = createWalletClient({
      account: ownerAddress as `0x${string}`,
      chain: base,
      transport: custom({
        async request({ method, params }) {
          return await wallet.provider?.request({ method, params })
        }
      })
    })
    const smartAccount = await createSmartAccountClient({
      signer: client as any,
      bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL || '',
      biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_KEY,
      chainId: ChainId.BASE_MAINNET
    })
    // const xmtp = await Client.create(smartAccount);
    // setXmtp(xmtp);
  }

  const startConversation = async () => {
    // Start a conversation with XMTP
    const conversation = await xmtp.conversations.newConversation(
      '0x3F11b27F323b62B159D2642964fa27C46C841897'
    );
    setConversation(conversation);
  }

  const getMessages = async () => {
    if (conversation) {
      const messages = await conversation.messages();
      setMessages(messages);
    }
  }

  const sendMessage = async () => {
    if (conversation) {
      // Send a message
      await conversation.send('gm')
    } else {
      console.log('No conversation to send message to');
    }
  }

  useEffect(() => {
    if (conversation) {
      getMessages();
      listenForNewConversations();
    }
  }, [conversation]);

  // listen for new conversations
  const listenForNewConversations = async () => {
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Inbox!</Text>
      <Button
        onPress={() => startConversation()}
      >
        <ButtonText>Start convo</ButtonText>
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
});
