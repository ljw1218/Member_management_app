import React, { useState, useEffect } from 'react';
import { Button, Text, StyleSheet, View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import Dialog from 'react-native-popup-dialog';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import format from 'date-fns/format';
import { startOfDay, startOfWeek } from 'date-fns';

interface TabCProps {
  username: string;
  adminname: string;
}

const TabC: React.FC<TabCProps> = ({ username, adminname }) => {
  const [imageList, setImageList] = useState<{ url: string; name: string; }[]>([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [visible, setVisible] = useState(false);
  const [isadmin, setIsAdmin] = useState(false);
  const [isRemMode, setIsRemMode] = useState(false);

  const loadImages = async () => {
    const imageRefs = await storage().ref().child('images/' + username).listAll();
    const images: { url: string; name: string; }[] = [];
    for (const ref of imageRefs.items) {
      const url = await ref.getDownloadURL();
      images.push({ url, name: ref.name });
    }
    setImageList(images);
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await firestore().collection('users').doc(adminname).get();
      const doc2 = await firestore().collection('users').doc(username).get();
      const adminPassword = doc.data()?.adminPassword;
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startweek = new Date(now.setDate(now.getDate() - ((dayOfWeek + 6) % 7)))
      const strStart = format(startweek, 'yyyy-MM-dd');
      const data = doc2.data();

      if (adminPassword == 'Paradream0203') {
        setIsAdmin(true)
      }
      if (data && data[strStart]) {
        setUploadCount(data[strStart]);
      }
    }
    fetchDoc();
  }, []);

  const removefromimageList = () => {
    setImageList(prev => prev.filter(image => image.name !== selectedImage));
  }

  const executeRemoval = async () => {
    await storage().ref().child('images/' + username + '/' + selectedImage).delete();
    removefromimageList();
    setSelectedImage('');
    setIsRemMode(false);
    Alert.alert('완료','삭제 완료');
  }

  const UpdateCount = async () => {
    const doc = await firestore().collection('users').doc(username).get();
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startweek = new Date(now.setDate(now.getDate() - ((dayOfWeek + 6) % 7)))
    const strStart = format(startweek, 'yyyy-MM-dd');
    const data = doc.data();
    
    if (data && data[strStart]) {
      firestore().collection('users').doc(username).update({
        [strStart]: firebase.firestore.FieldValue.increment(1)
      });
      setUploadCount(uploadCount+1)
    }
    else {
      firestore().collection('users').doc(username).set({
        [strStart]: 1
      }, { merge: true })
      setUploadCount(1);
    };
  }
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.assets && response.assets[0].uri) {
        const uri = response.assets[0].uri;
        if (!response.didCancel && uri) {
          const blob = await (await fetch(uri)).blob();
          const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss'); // Format the current date and time
          const uploadTask = storage().ref().child('images/' + username + '/' + currentDate).put(blob);
          uploadTask.on('state_changed', () => { }, () => { }, () => {
            UpdateCount();
          });
        }
      }
    });
  };

  const onRemovePress = () =>
  {
    setIsRemMode(true);
    Alert.alert('알림','삭제 할 이미지 선택 후 실행');
  }

  return (
    <View style={styles.container}>
      {isadmin ? (<Button title="Remove" onPress={onRemovePress}/>) : (
        uploadCount < 4 && <Button title="Upload" onPress={pickImage} />
      )}
      <ScrollView>
      {imageList.map(image => (
        isRemMode?
        <TouchableOpacity
          style={selectedImage.includes(image.name) ? styles.selectedImage : {}}
          onPress={() => setSelectedImage(image.name)}
          key={image.name}
          >
            <Text style={{fontSize:17}}>{image.name}</Text>
          </TouchableOpacity>
        :<Button
          title={image.name}
          onPress={() => { setSelectedImage(image.url); setVisible(true); }}
          key={image.name}
        />
      ))}
      </ScrollView>
      <Dialog
        visible={visible}
        onTouchOutside={() => { setVisible(false); }}
      >
        <Image source={{ uri: selectedImage }} style={{ width: 400, height: 400 }} />
      </Dialog>
      {isRemMode &&
       <View style={styles.rowContainer}>
          <Button title="실행" onPress={executeRemoval}/>
          <Button title="취소" onPress={()=>setIsRemMode(false)}/>
        </View>
       }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rowContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectedImage: {
    backgroundColor : '#ccc'
  }
});

export default TabC;
