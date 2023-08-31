import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { Alert, Button, TextInput, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import SInfo from 'react-native-sensitive-info';
import MainScreen from './MainScreen';
import RegisterScreen from './RegisterScreen';
import ScreenUser from './ScreenUser';
import ScreenAdmin from './ScreenAdmin';

const App : React.FC= () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [registerPageVisible, setRegisterPageVisible] = useState(false);
  const [screen, setScreen] = useState<'Admin' | 'Users' | null>(null);
  const [email, setEmail] = useState('');

  const handleLogin = (username: string, password: string, saveID: boolean) => {
    auth().signInWithEmailAndPassword(username,password)
    .then(async (result) =>{
      if (result.user){
        setEmail(result.user.uid);
        if(saveID){
          AsyncStorage.setItem('email',username);
          SInfo.setItem('password',password,{});
          console.log('saveid');
        }
        const doc = await firestore().collection('users').doc(result.user.uid).get();
        const adminPassword = doc.data()?.adminPassword;
        if (adminPassword == 'Paradream0203'){
          setScreen('Admin');
          console.log('admin')
        }
        else{
          setScreen('Users');
          console.log('users');
        }
        setLoggedIn(true);
        return;
     }
     else{
      Alert.alert('wrong','wrong info');
      return;
     }
    }).catch((error)=>{
        Alert.alert('Fail to login',error.message);
        console.error(error);
    });
  };

  const handleRegister = async (username: string, password: string) => {
    // 회원가입 로직 구현 및 처리
    // ...
    const user = {
      username,
      password,
    };
    // 회원가입 성공 시
    handleLogin(username,password,false);
  };
  const handleRegisterPage = () => {
    setRegisterPageVisible(true);
  };

  const handleRegisterBack = () => {
    setRegisterPageVisible(false);
  };
  const handleLogout = () => {
    setLoggedIn(false);
  }
  return (
    <View style={{ flex: 1 }}>
      {loggedIn ? (
        <>
        {screen == 'Admin'?(
            <ScreenAdmin onLogout={handleLogout} props={email}/>
            
        ) : (
          <ScreenUser onLogout={handleLogout} props={email}/>
          
        )
        
      }
        </>
      ) : (
        <>
          {registerPageVisible ? (
            <RegisterScreen onRegister={handleRegister} onBack={handleRegisterBack} />
          ) : (
            <MainScreen onLogin={handleLogin} onRegister={handleRegisterPage} />
          )}
        </>
      )}
    </View>
  );
};
export default App;