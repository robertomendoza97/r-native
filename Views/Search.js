import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RecordDate from './RecordDate';

const Search = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [records, setRecords] = useState([]);
  const [searching, setSearching] = useState(false);
  const maximumDate = useMemo(() => {
    return new Date();
  });

  const queryForDate = date => {
    setShowDatePicker(false);
    setDate(date);
  };

  let controller = new AbortController();
  let month =
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();
  let year = date.getFullYear();

  const askToServ = async () => {
    setTimeout(() => {
      controller.abort();
    }, 5000);
    try {
      const data = await fetch(
        `https://api.loomischile.cl/control/dateDetail/${year}-${month}-${day}`,
        {
          signal: controller.signal,
        },
      );
      const dataJson = await data.json();

      if (dataJson.results.length == 0) {
        Alert.alert(
          'Aviso',
          'No se encontraron resultados para la fecha indicada.',
          [{text: 'ok'}],
        );
      } else if (!dataJson.success) {
        Alert.alert(
          'Error',
          'Ocurrio algo inesperado, por favor contacta al area TI.',
          [{text: 'ok'}],
        );
      } else if (dataJson.results.length > 0) {
        setRecords(dataJson.results);
      }
      setSearching(false);
    } catch (error) {
      if (navigation.isFocused()) {
        Alert.alert(
          'Error',
          'Ocurrio un problema con la red, verifique su conexion e intente otra vez',
          [
            {
              text: 'ok',
              onPress: () => {
                setSearching(false);
              },
            },
          ],
        );
      }
    }
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (searching) {
        controller.abort();
        setSearching(false);
      }
    });
  }, []);

  useEffect(() => {
    if (searching) {
      askToServ();
    }

    return function clean() {
      // setSearching(false);
    };
  }, [searching]);

  return (
    <>
      <View style={styles.wrapperScreen}>
        <View style={styles.wrapperDate}>
          <Pressable
            style={styles.btnDate}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.textBtnDate}>Elegir fecha</Text>
          </Pressable>
          <DatePicker
            modal
            open={showDatePicker}
            onConfirm={date => {
              queryForDate(date);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            maximumDate={maximumDate}
            mode="date"
            date={date}
            locale="es"
          />
        </View>
        <View style={styles.wrapperBtnDate}>
          <Text style={styles.dateText}>
            {day}-{month}-{year}
          </Text>
          <Pressable
            onPress={() => setSearching(true)}
            style={styles.btnDateSearch}>
            <Text style={styles.textSearch}>Buscar</Text>
          </Pressable>
        </View>
        <View style={styles.wrapperContent}>
          {records.length ? (
            <ScrollView style={styles.wrapperRecords}>
              {records.map((x, i) => (
                <RecordDate x={x} key={i} />
              ))}
            </ScrollView>
          ) : searching ? (
            <View style={styles.wrapperImg}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <View style={styles.wrapperImg}>
              <Text style={styles.textHome}>
                Seleccione una fecha y presione buscar.
              </Text>
              <Image
                style={styles.img}
                source={require('../Assets/img/homeSearch.png')}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapperScreen: {
    flex: 1,
  },
  wrapperDate: {
    width: '100%',
    alignItems: 'center',
  },
  btnDate: {
    borderWidth: 1,
    width: '80%',
    backgroundColor: '#306097',
    marginVertical: 15,
    borderRadius: 5,
  },
  textBtnDate: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  wrapperBtnDate: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginHorizontal: 30,
  },
  btnDateSearch: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#306097',
    marginBottom: 10,
    borderRadius: 5,
  },
  textSearch: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  dateText: {
    marginBottom: 10,
    fontSize: 24,
  },
  wrapperImg: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 300,
    height: 300,
  },
  textHome: {
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 20,
    color: '#b6b6b6',
    marginVertical: 10,
  },
  wrapperContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperRecords: {
    padding: 15,
    width: '100%',
    flex: 1,
  },
});

export default Search;
