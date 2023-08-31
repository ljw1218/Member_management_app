import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { Alert, Button, TextInput, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, {RadioButton,RadioButtonInput,RadioButtonLabel} from 'react-native-simple-radio-button';
import SInfo from 'react-native-sensitive-info';

type RegisterScreenProps = {
    onRegister: (username: string, password: string) => void;
    onBack: () => void;
  }
  const RegisterScreen = ({ onRegister, onBack }: RegisterScreenProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [gender, setGender] = useState('');
    const [area, setArea] = useState('');
    const [work, setWork] = useState('');
    const [number, setNumber] = useState('');
  
    const gender_props = [
      {label: '남', value : 'male'},
      {label: '여', value : 'female'}
    ];
    const birthYearItems = Array.from({length: 123},(_, i)=> new Date().getFullYear() - i)
    .map(year => ({label: String(year), value: year}));
  
    const handleRegister = async () => {
      if (username && password && confirmPassword && name && gender &&area && work && number) {
        try {
          if (password !== confirmPassword) {
            Alert.alert('등록 오류', 'PWD가 일치하지 않습니다.');
            return;
          }
  
          if (isAdmin == true) {
            if (adminPassword != 'Paradream0203') {
              Alert.alert('등록 오류', '관리자 비밀번호가 틀렸습니다.');
              return;
            }
          }
          const userCredential = await auth().createUserWithEmailAndPassword(username, password);
  
          if (userCredential.user){
            await firestore().collection('users').doc(userCredential.user.uid).set({
              name,
              birthYear,
              gender,
              area,
              work,
              number,
              adminPassword
            })
            Alert.alert('완료','가입 완료.',[
              {text: 'OK', onPress: ()=> onBack()}
            ]);
          }
        } catch (error: any) {
          if (error.code == 'auth/email-already-in-use') {
            Alert.alert('중복 체크', '이미 가입이 된 Email 입니다.');
          }
          else {
            Alert.alert('오류', error.code);
          }
        }
      } else {
        Alert.alert('등록 오류', '모든 필드를 입력해주세요.');
      }
    };
  
    const handleCancel = () => {
      onBack();
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%', transform: [{ scale: 0.7 }] }}>
          <CheckBox value={isAdmin} onValueChange={setIsAdmin} />
          <Text style={{ fontSize: 25, marginLeft: 12 }}>관리자 계정</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%', marginTop: 10 }}>
          <Text style={{width:'32%'}}>Email : </Text>
          <TextInput
            style={{ flex: 5, marginRight: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="email"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>PWD : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="PWD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>PWD 확인 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="PWD 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>이름 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="이름"
            value={name}
            onChangeText={setName}
          />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%',marginBottom:10 }}>
          <Text style={{marginRight:8}}>출생 년도 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="출생년도"
            value={birthYear}
            onChangeText={setBirthYear}
          />
          </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>성별 : </Text>
          <RadioForm
            radio_props={gender_props}
            initial={-1}
            formHorizontal={true}
            labelHorizontal={true}
            onPress={setGender}
            
            />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>사는 곳 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="사는 곳"
            value={area}
            onChangeText={setArea}
            
          />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>직업 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="직업"
            value={work}
            onChangeText={setWork}
            
          />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Text style={{width:'32%'}}>전화번호 : </Text>
          <TextInput
            style={{ flex: 2, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 5, height: 40 }}
            placeholder="전화번호"
            value={number}
            onChangeText={setNumber}
            
          />
        </View>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          {isAdmin && (
            <TextInput
              style={{ flex: 2, borderWidth: 1, marginBottom: 10, borderColor: 'gray', padding: 5, height: 40 }}
              placeholder='관리자 비밀번호'
              value={adminPassword}
              onChangeText={setAdminPassword}
              secureTextEntry />
          )}
        </View>
        <Button title="등록" onPress={handleRegister} />
        <Button title="취소" onPress={handleCancel} />
      </View>
    );
  };
  export default RegisterScreen;