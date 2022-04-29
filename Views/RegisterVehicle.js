import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import UserRecord from './UserRecord';
import ModalAddUser from './ModalAddUser';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import UserContext from '../Assets/UserContext';

const ButtonSearch = ({navigation}) => {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Search')}>
      <Image
        style={{width: 35, height: 35, tintColor: '#fff'}}
        source={require('../Assets/img/search.png')}
      />
    </TouchableWithoutFeedback>
  );
};

const ButtonLogout = () => {
  const ctx = useContext(UserContext);

  return (
    <TouchableWithoutFeedback onPress={() => ctx.logout()}>
      <Image
        style={{width: 35, height: 35, tintColor: '#fff'}}
        source={require('../Assets/img/logout.png')}
      />
    </TouchableWithoutFeedback>
  );
};

const RegisterVehicle = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonSearch navigation={navigation} />,
      headerLeft: () => <ButtonLogout />,
    });
  }, []);

  const [users, setUsers] = useState([]);
  const [patente, setPatente] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [swipeableRef, setSwipeableRef] = useState([]);

  const _scrollView = useRef();
  const helperPatente = text => {
    let cleanText = text.trim();
    setPatente(cleanText);
  };

  const sendData = async () => {
    const date = new Date();
    const month =
      date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth();
    const fecha = `${date.getFullYear()}-${month}-${date.getDate()}`;
    const hora = `${date.getHours()}:${date.getMinutes()}`;
    const obj = {
      patente,
      fecha,
      hora,
      personas: users,
    };
    try {
      const data = await fetch(`https://api.loomischile.cl/control/saveCrew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const dataJson = await data.json();
      if (dataJson.success) {
        Alert.alert('ENVIADO', 'La tripulacion se guardo exitosamente', [
          {
            text: 'ok',
            onPress: () => {
              setPatente('');
              setUsers([]);
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrio un error de red, verifica tu conexion e intenta de nuevo.',
        [{text: 'ok'}],
      );
    }
  };

  const validateSendData = () => {
    if (patente.length < 6) {
      Alert.alert('Error', 'La patente no cuenta con los digitos correctos.', [
        {text: 'ok'},
      ]);

      return;
    } else if (users.length == 0) {
      Alert.alert('Aviso', 'Debe registrar al menos un tripulante', [
        {text: 'ok'},
      ]);
    } else {
      sendData();
    }
  };

  useEffect(() => {
    _scrollView.current.scrollToEnd();
  }, [mostrarModal]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.wrapperGeneral}>
          <View style={styles.wrapperPatente}>
            <Text style={styles.title}>Registrar tripulacion</Text>
            <TextInput
              placeholder="PATENTE"
              placeholderTextColor="#c6c6c6"
              style={styles.inputPatente}
              value={patente}
              maxLength={6}
              onChangeText={text => helperPatente(text)}
            />
            <View style={styles.wrapperBtnAdd}>
              <TouchableHighlight
                onPress={() => setMostrarModal(true)}
                style={styles.btnAdd}>
                <Image
                  style={styles.imgAdd}
                  source={require('../Assets/img/add.png')}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View
            style={styles.wrapperScrollView}
            onStartShouldSetResponder={() => true}>
            <ScrollView
              ref={_scrollView}
              decelerationRate={0.9}
              onStartShouldSetResponder={() => true}
              style={styles.scrollView}>
              {users.length ? (
                <View style={styles.wrapperRegisters}>
                  {users.map((user, i) => (
                    <UserRecord
                      setUsers={setUsers}
                      position={i}
                      key={i}
                      user={user}
                      id={user.id}
                      swipeableRef={swipeableRef}
                      setSwipeableRef={setSwipeableRef}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.wrapperImg}>
                  <Text style={styles.textHome}>
                    Agregue una persona en el boton de MAS (+)
                  </Text>
                  <Image
                    style={styles.img}
                    source={require('../Assets/img/homeSearch.png')}
                  />
                </View>
              )}
            </ScrollView>
          </View>
          <View style={styles.wrapperBtnEnd}>
            <TouchableHighlight
              onPress={validateSendData}
              style={styles.btnEnd}>
              <Text style={styles.textBtnEnd}>FINALIZAR</Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ModalAddUser
        setUsers={setUsers}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapperPatente: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
    marginVertical: 7,
  },
  scrollView: {
    flex: 1,
  },
  inputPatente: {
    borderWidth: 1,
    width: '70%',
    textAlign: 'center',
    fontSize: 24,
    borderRadius: 5,
    // textTransform: 'uppercase',
  },
  wrapperBtnAdd: {
    width: 50,
    height: 50,
  },
  btnAdd: {
    width: '100%',
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#84b6f4',
  },
  imgAdd: {
    width: 50,
    height: 50,
    tintColor: '#fff',
  },
  wrapperGeneral: {
    flex: 1,
  },
  wrapperScrollView: {
    flex: 1,
    padding: 10,
  },
  wrapperBtnEnd: {
    height: 50,
    alignItems: 'center',
  },
  btnEnd: {
    borderWidth: 1,
    padding: 10,
    width: '80%',
    backgroundColor: '#004174',
    borderRadius: 4,
  },
  textBtnEnd: {
    textAlign: 'center',
    color: '#fff',
  },
  wrapperImg: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 250,
    height: 250,
  },
  textHome: {
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 20,
    color: '#b6b6b6',
    marginVertical: 10,
  },
});

export default RegisterVehicle;
