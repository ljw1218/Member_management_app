import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

interface CalendarScreenProps {
  username: string;
}

interface DayPressObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

const TabB: React.FC<CalendarScreenProps> = ({ username }) => {
  const [data, setData] = useState<Record<string, any>>({});

  const loadData = async () => {
    const dbData = await firestore()
      .collection('users')
      .doc(username)
      .get();

    setData(dbData.data() || {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const markedDates = Object.keys(data).reduce<Record<string, any>>(
    (marked, date) => {
      marked[date] = {
        selected: true,
        marked: false, // marked 속성 값은 true로 설정
        dotColor: 'white', // 점의 색상
        dotText: 'asdf', // 특정 문자
        selectedColor: data[date]?.OX ? 'blue' : 'red',
      };
      return marked;
    },
    {}
  );

  const handleDayPress = useCallback((date: DayPressObject) => {
    const dateString = date.dateString;
    if (data[dateString]) {
      Alert.alert(` ${dateString} \n 시간: ${data[dateString].number} 분`);
    }
  }, [data]);

  return (
    <View>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
    </View>
  );
};

export default TabB;
