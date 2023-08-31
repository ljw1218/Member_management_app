import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { Alert, Button, TextInput, View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import SInfo from 'react-native-sensitive-info';
import TabInfo from './TabInfo';
import TabB from './TabB';
import TabC from './TabC';

interface DSProps{
    props : string;
    adminname : string;
    onBack : () => void;
}
const DetailScreen:React.FC<DSProps> = ({props,adminname,onBack}) =>{
    const [selectedTab, setSelectedTab] = useState('TabInfo');
    const username = props;
 

 useEffect(() => {
   firestore()
     .collection('users')
     .doc(username)
     .onSnapshot(documentSnapshot => {
       console.log('User data: ', documentSnapshot.data());
     });
 }, [username]);
const handleOnBack = () =>{
    onBack();
}
return (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.spacer} />
      <Button title="뒤로" onPress={handleOnBack}/>
    </View>
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setSelectedTab('TabInfo')} style={selectedTab === 'TabInfo' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabInfo' ? styles.selectedTabText : null}>정보</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('TabB')} style={selectedTab === 'TabB' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabB' ? styles.selectedTabText : null}>등록 현황</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('TabC')} style={selectedTab === 'TabC' ? styles.selectedTab : null}>
        <Text style={selectedTab === 'TabC' ? styles.selectedTabText : null}>이미지 현황</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      {selectedTab === 'TabInfo' && <TabInfo uid={username}/>}
      {selectedTab === 'TabB' && <TabB username={username}/>}
      {selectedTab === 'TabC' && <TabC username={username} adminname={adminname}/>}
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
    justifyContent: 'flex-start',
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

export default DetailScreen;