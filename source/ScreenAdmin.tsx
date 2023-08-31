import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet,TextInput,Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DetailScreen from './DetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info';

type User = {
  uid : string;
  name: string;
  gender: string;
  adminPassword : string;
  birthYear: number;
};

interface ScreenAdminProps {
  props: string;
  onLogout: () => void;
};

const ScreenAdmin: React.FC<ScreenAdminProps> = ({ props, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [onbutton,setOnButton] = useState(false);
  const [selectedname,setName] = useState('');
  const [selecteduid,setUid] = useState('');

  useEffect(() => {
    // Firestore에서 사용자 데이터 가져오기
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const data: User[] = [];
        querySnapshot.forEach((doc) => {
          const user = {uid:doc.id,...doc.data()} as User;
          data.push(user);
        });
        setUsers(data);
      });

    return () => unsubscribe(); // cleanup 함수로 구독 해제
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('email');
   SInfo.deleteItem('password', {});
    onLogout(); // 로그아웃 처리
  };

  const handleItemPress = (name: string,uid : string) => {
    setName(name);
    setUid(uid);
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.item, item.name === selectedname ? styles.selectedItem : null]}
      onPress={() => handleItemPress(item.name,item.uid)}
    >
      <Text>{item.name}{item.adminPassword === 'Paradream0203' ? ' (관)' : ''}</Text>
      <Text>{item.gender}</Text>
      <Text>{item.birthYear}</Text>
    </TouchableOpacity>
  );

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const filteredUsers = searchText ? users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  ) : users;

  const handleOnBack = () =>{
    setOnButton(false);
  }

  return (
    <View style={styles.centered}>
        {onbutton? (
                <DetailScreen onBack={handleOnBack} props={selecteduid} adminname={props}/>
        ):(
            <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <View style={styles.searchBar}>
        <Text>Search:</Text>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        style={styles.list}
      />
      <Button title="보기" onPress={() => setOnButton(true)} />
    </View>
        )}
    </View>
  );
};

export default ScreenAdmin;

const styles = StyleSheet.create({
centered:{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',  
},
  container: {
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
  list: {
    marginTop:10,
    marginLeft:30,
    marginBottom:20,
    width:'80%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  selectedItem: {
    backgroundColor: 'gray',
  },
});
