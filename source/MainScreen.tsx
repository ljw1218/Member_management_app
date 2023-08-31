import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { Alert, Button, TextInput, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SInfo from 'react-native-sensitive-info';

type MainScreenProps = {
    onLogin: (username: string, password: string, save: boolean) => void;
    onRegister: () => void;
  }
  const MainScreen = ({ onLogin, onRegister }: MainScreenProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [saveID, setSaveID] = useState(false);
  
    useEffect(()=>{
      retrieveData();
    },[]);
  
    const retrieveData = async () =>{
      try{
        const value = await SInfo.getItem('password',{});
        if (value != null){
          setPassword(value);
        }
        const user = await AsyncStorage.getItem('email');
        if (user != null){
          setUsername(user);
          onLogin(user,value,true);
        }
      }catch(error){
        console.log(error);
      }
    }
  
    const handleLogin = async() => {
      if (username && password) {
          onLogin(username, password,saveID);
      } else {
        Alert.alert('로그인 정보 오류', 'email와 PWD를 입력해주세요.');
      }
    };
  
    const handleRegister = () => {
      onRegister();
    };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%', transform: [{ scale: 0.7 }],marginTop:10 }}>
          <CheckBox value={saveID} onValueChange={setSaveID} />
          <Text style={{ fontSize: 25, marginLeft: 12 }}>자동 로그인</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <TextInput
            style={{ flex: 5, marginTop: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <TextInput
            style={{ flex: 5, marginTop: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="PWD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <Button title="Login" onPress={handleLogin} />
        <Button title="회원가입" onPress={handleRegister} />
        
      </View>
    );
  };

  export default MainScreen;