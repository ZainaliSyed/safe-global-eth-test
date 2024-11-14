import React, { useState } from "react";
import { StyleSheet, Button, Text, View, Alert } from "react-native";
import Keychain from "react-native-keychain";
import { privateKeyToAccount } from "viem/accounts";
import * as Crypto from "expo-crypto";


export default function Signer(): JSX.Element {
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const createPrivateKey = async (): Promise<void> => {
    try {
       const randomBytes = await Crypto.getRandomBytesAsync(32);
      const newPrivateKey = `0x${Buffer.from(randomBytes).toString("hex")}`;
      await Keychain.setGenericPassword("ethereum", newPrivateKey, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      Alert.alert('Private key generated and stored securely.');

    } catch (error) {
      console.error("Error generating or storing private key:", error);
    }
  };

  const revealPrivateKey = async (): Promise<void> => {
    try {
      const credentials = await Keychain.getGenericPassword();
      
      if (credentials) {
        setPrivateKey(credentials.password);
        console.log("Private key retrieved successfully.");
      } else {
        console.log("No private key stored.");
      }
    } catch (error) {
      console.error("Error retrieving private key:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Generate an account by random key"
        onPress={createPrivateKey}
      />

      <Button
        title="Reveal private key for generated account"
        onPress={revealPrivateKey}
      />

      <Text>Private key: {privateKey || "No key generated"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



