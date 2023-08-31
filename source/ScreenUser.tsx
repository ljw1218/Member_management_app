import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { Alert, Button, TextInput, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import SInfo from 'react-native-sensitive-info';
import TabA from './TabA';
import TabB from './TabB';
import TabC from './TabC';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ScreenUserProps{
    props : string;
    onLogout : () => void;
  };

const ScreenUser:React.FC<ScreenUserProps> = ({props,onLogout})=>{
  const [selectedTab, setSelectedTab] = useState('TabA');
  const [logedout, setLogedout] = useState(false);
  const username = props;
  
 const handleLogout = () => {
   AsyncStorage.removeItem('email');
   SInfo.deleteItem('password', {});
   setLogedout(true);
   onLogout();
 };

 useEffect(() => {
   firestore()
     .collection('users')
     .doc(username)
     .onSnapshot(documentSnapshot => {
       console.log('User data: ', documentSnapshot.data());
     });
 }, [username]);

return (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.spacer} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setSelectedTab('TabA')} style={selectedTab === 'TabA' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabA' ? styles.selectedTabText : null}>등록</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('TabB')} style={selectedTab === 'TabB' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabB' ? styles.selectedTabText : null}>등록 현황</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('TabC')} style={selectedTab === 'TabC' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabC' ? styles.selectedTabText : null}>이미지 등록</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      {selectedTab === 'TabA' && <TabA username={username}/>}
      {selectedTab === 'TabB' && <TabB username={username}/>}
      {selectedTab === 'TabC' && <TabC username={username} adminname=''/>}
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  selectedTab: {
    backgroundColor: '#C5C5C5',  // 원하는 색상으로 변경하세요.
  },
  selectedTabText: {
    fontWeight: 'bold',
  },
});

export default ScreenUser;