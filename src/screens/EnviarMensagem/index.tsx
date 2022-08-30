 
import styles from "./styles";
import { ChatTypes } from "../../types/Screen.types";
import { AxiosError } from "axios";
import { IResponse } from "../../interfaces/Response.interface";
import { apiMensagem, apiTopico } from "../../services/data";
import { ITopicoState, ITopicoServer } from "../../interfaces/Topico.interface";
import MultiSelect from "react-native-multiple-select";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { IMensagem } from "../../interfaces/Mensagem.interface";
import colors from "../../styles/colors"
import React, {useState, useEffect} from "react";
import { Alert } from "react-native";


export default function EnviarMensagem({ navigation }: ChatTypes) {
  const [data, setData] = useState<IMensagem>();
  const [isLoading, setIsLoading] = useState(true);
  const [topico, setTopico] = useState<ITopicoState[]>([]);
  const [selectedTopico, setSelectedTopico] = useState([]);
  const [startOver, setStartOver] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.back);
  let camera: Camera;

  const takePicture = async () => {
    if (!camera) return;
    const option = { quality: 0.5, base64: true};
    const photo = await camera.takePictureAsync(option);
    setData({ ...data, imagem: photo});
    setStartOver(true);
  };

  const pickImage= async() =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [3, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setData({...data, imagem: result});
    }
  };

  function handleVoltar() {
    navigation.navigate("Chat");
  };

  function handleChange(item: IMensagem){
    setData({...data, ...item});
  };

  async function handleSubmit() {
    try {
      setIsLoading(true);
      if(data?.titulo && data.mensagem && selectedTopico && data.imagem) {
        const imageName = data.imagem.uri?.split("/").pop();
        const formData = new FormData();
        formData.append("imagem", data.imagem.base64);
        if(imageName){
          formData.append("file", imageName);
        }
        formData.append("titulo", data.titulo);
        formData.append("mensagem", data.mensagem);
        selectedTopico.forEach((e) =>{
          formData.append("topico[]", e);
        });
        await apiMensagem.store(formData as IMensagem);
        navigation.navigate("Chat");
      }else{
        Alert.alert("Preencha todos os campos!!!");
        setIsLoading(false);
      }
    } catch(error) {
      const err = error as AxiosError;
      const data = err.response?.data as IResponse;
      let message = "";
      if (data.data) {
        for (const [key, value] of Object.entries(data.data)){
          message = `${message} ${value}`;
      }
    }
  }
}