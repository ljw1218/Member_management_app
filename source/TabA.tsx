import React, {useState} from 'react';
import {Button, TextInput, View, StyleSheet, TouchableOpacity, Text,Alert} from 'react-native';
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface Props {
 username: string;
}

const TabA: React.FC<Props> = ({username}) => {
 const [date, setDate] = useState(getFormattedDate(0)); // default to today
 const [number, setNumber] = useState('');
 const [OX, setOX] = useState<boolean | null>(null);

 const onRegister = async () => {
   const docRef = firestore().collection('users').doc(username);
   const doc = await docRef.get();

   if (doc.exists) {
     await docRef.update({
       [date]: {
         number,
         OX,
       },
     });
     Alert.alert('등록 완료','정보가 등록 되었습니다.');
   } else {
     await docRef.set({
       [date]: {
         number,
         OX,
       },
     });
     Alert.alert('등록 완료','정보가 등록 되었습니다.');
   }
 };

 return (
   <View style={styles.container}>
     <View style={styles.dateButtons}>
       <TouchableOpacity
         style={[styles.dateButton, date === getFormattedDate(-2) && styles.selected]}
         onPress={() => setDate(getFormattedDate(-2))}>
         <Text>{getDateDisplay(-2)}</Text>
       </TouchableOpacity>
       <TouchableOpacity
         style={[styles.dateButton, date === getFormattedDate(-1) && styles.selected]}
         onPress={() => setDate(getFormattedDate(-1))}>
         <Text>{getDateDisplay(-1)}</Text>
       </TouchableOpacity>
       <TouchableOpacity
         style={[styles.dateButton, date === getFormattedDate(0) && styles.selected]}
         onPress={() => setDate(getFormattedDate(0))}>
         <Text>{getDateDisplay(0)}</Text>
       </TouchableOpacity>
     </View>
     <View style={styles.inputContainer}>
       <TextInput
         style={styles.input}
         placeholder="Number"
         value={number}
         onChangeText={setNumber}
         keyboardType="numeric"
       />
       <View style={styles.oxButtons}>
         <TouchableOpacity
           style={OX ? styles.selectedOX : styles.oxButton}
           onPress={() => setOX(true)}
           disabled={number === ''}>
           <Text>O</Text>
         </TouchableOpacity>
         <TouchableOpacity style={OX === false ? styles.selectedOX : styles.oxButton} onPress={() => setOX(false)}>
           <Text>X</Text>
         </TouchableOpacity>
       </View>
     </View>
     <Button title="등록" onPress={onRegister} />
   </View>
 );
};

const getFormattedDate = (offset: number): string => {
 let date = new Date();
 date.setDate(date.getDate() + offset);
 const yyyy = date.getFullYear();
 const mm = String(date.getMonth() + 1).padStart(2, '0');
 const dd = String(date.getDate()).padStart(2, '0');
 return `${yyyy}-${mm}-${dd}`;
};

const getDateDisplay = (offset: number): string => {
 let date = new Date();
 date.setDate(date.getDate() + offset);
 const options:Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
 return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

// rest of the code...


const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   paddingHorizontal: 15,
 },
 dateButtons: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 20,
 },
 dateButton: {
   padding: 10,
   borderWidth: 1,
   borderColor: 'grey',
 },
 selected: {
   backgroundColor: 'grey',
 },
 inputContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 20,
 },
 input: {
   flex: 1,
   marginRight: 10,
   borderWidth: 1,
   borderColor: 'grey',
   padding: 10,
 },
 oxButtons: {
   flexDirection: 'row',
 },
 oxButton: {
   marginLeft: 10,
   padding: 10,
   borderWidth: 1,
   borderColor: 'grey',
 },
 selectedOX: {
   marginLeft: 10,
   padding: 10,
   borderWidth: 1,
   borderColor: 'grey',
   backgroundColor: 'grey',
 },
});

export default TabA;
