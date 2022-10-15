import React, {useState, useEffect} from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import CardSocial from "../../components/CardSocial";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles";
import Button from "../../components/Button";
import { useAuth } from "../../hook/auth";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../services/data/Push";
import { MapTypes } from "../../types/Screen.types";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Pagamento({ navigation }: MapTypes) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  function handleMap() {
    navigation.navigate("Pagamento");
  }

  useEffect(() => {
    if (user&& user.profile_photo_url) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function fetchToken() {
      const token = await registerForPushNotificationsAsync()
      console.log(token)
    }
    fetchToken()
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.profile_photo_url }} style={styles.img}/>
      <Text style={styles.title}>{user?.name}</Text>
      <CardSocial>
        <>
          <Text style={styles.link}>TELA PAGAMENTO</Text>
        </>
      </CardSocial>
      <CardSocial>
        <>
          <Text style={styles.link}>TELA PAGAMENTO</Text>
          <FontAwesome5 name="star" style={styles.icon} />
        </>
      </CardSocial>
      <Button
        title="Alterar Senha"
        type="primary"
        onPress={handleMap}
      />
      <Button
        title="Sair"
        type="primary"
        onPress={() => console.log("Sair")}
      />
      </View>
  );
}