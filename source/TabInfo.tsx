import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

type User = {
  name: string;
  birthYear: number;
  gender: 'male' | 'female';
  area: string;
  work: string;
  number: string;
  adminPassword?: string;
};

interface TabInfoProps {
  uid: string;
}

const TabInfo: React.FC<TabInfoProps> = ({ uid }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const documentSnapshot = await firestore().collection('users').doc(uid).get();
        const userData = documentSnapshot.data() as User;
        setUser(userData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [uid]);

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Birth Year: {user.birthYear}</Text>
          <Text>Gender: {user.gender === 'male' ? '남' : '여'}</Text>
          <Text>Area: {user.area}</Text>
          <Text>Work: {user.work}</Text>
          <Text>Number: {user.number}</Text>
          {user.adminPassword && <Text>Admin Password: {user.adminPassword}</Text>}
        </>
      )}
    </View>
  );
};

export default TabInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
