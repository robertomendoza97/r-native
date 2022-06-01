import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  Alert,
} from 'react-native';
import UserContext from '../Assets/UserContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const ctx = useContext(UserContext);

  let controller = new AbortController();

  const sendUserToServ = async () => {
    if (!user.username || !user.password) {
      Alert.alert('¡Campo vacio!', 'Debes llenar ambos campos ', [
        {text: 'ok'},
      ]);
      setLogin(false);

      return;
    }
    try {
      ctx.loading();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const data = await fetch('https://api.loomischile.cl/', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      const dataJson = await data.json();

      if (dataJson.success) {
        await AsyncStorage.setItem('log', 'true');
        ctx.login('log');
      } else {
        ctx.logout();
        Alert.alert('Error', dataJson.err, [{text: 'ok'}]);
      }
    } catch (error) {
      ctx.logout();
      Alert.alert(
        '¡Ups!',
        'Ocurrio un problema de conexion, verifiquela e intente de nuevo.',
        [{text: 'ok'}],
      );

      return error;
    }
  };

  const helperAddDataUser = (text, prop) => {
    setUser({
      ...user,
      [prop]: text.trim(),
    });
  };

  useEffect(() => {
    if (login) {
      sendUserToServ();
    }
    return () => {
      setLogin(false);
    };
  }, [login]);

  useEffect(() => {
    (async () => {
      const log = await AsyncStorage.getItem('log');
      if (log) {
        ctx.login(log);
      } else {
      }
    })();
  }, []);

  useEffect(() => {
    // fetch("https://api.loomischile.cl/control/",{
    //   headers: {
    //     "Accept": "application/json",
    //     "Access-Control-Allow-Origin" : "*"
    //   }
    // }).then(resp => console.log(resp)).catch(err => console.log(err))

    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const response = await fetch('https://api.loomischile.cl/control/');
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          behavior={'padding'}
          keyboardVerticalOffset={100}
          style={styles.wrapperGeneral}>
          <View style={styles.wrapperImg}>
            <Image
              style={styles.imgLoomis}
              source={require('../Assets/img/logo.png')}
            />
          </View>
          <View style={styles.wrapperInput}>
            <Text style={styles.text}>USUARIO</Text>
            <TextInput
              onChangeText={text => helperAddDataUser(text, 'username')}
              value={user.username}
              style={styles.textInput}
            />
          </View>
          <View style={styles.wrapperInput}>
            <Text style={styles.text}>CLAVE</Text>
            <TextInput
              value={user.password}
              onChangeText={text => helperAddDataUser(text, 'password')}
              style={styles.textInput}
              secureTextEntry={true}
              keyboardType="default"
            />
          </View>
          <View>
            <TouchableHighlight
              style={styles.btnLogin}
              onPress={() => setLogin(true)}>
              <Text style={styles.textBtn}>INGRESAR</Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  imgLoomis: {
    width: '80%',
  },
  wrapperGeneral: {
    alignItems: 'center',
    flex: 1,
  },
  wrapperImg: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  text: {
    color: '#000',
    fontSize: 25,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  wrapperInput: {
    width: '70%',
    alignItems: 'center',
    marginVertical: 10,
  },
  btnLogin: {
    backgroundColor: '#a0d2f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginVertical: 15,
  },
  textBtn: {
    color: '#fff',
    fontSize: 30,
  },
});
export default LoginScreen;
