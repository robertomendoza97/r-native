import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

const ModalAddUser = ({mostrarModal, setMostrarModal, setUsers}) => {
  const [user, setUser] = useState({
    nombre_persona: '',
    apellido_paterno_persona: '',
    apellido_materno_persona: '',
    nro_tarjeta: '',
  });
  const [respNFC, setRespNFC] = useState(false);

  const helperCloseModal = () => {
    setMostrarModal(false);
    NfcManager.cancelTechnologyRequest();
    setRespNFC(false);
  };

  const getDataNFC = async () => {
    NfcManager.start();
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      const data = await fetch(
        `https://api.loomischile.cl/control/idPerson/${tag.id}`,
      );
      const dataJson = await data.json();
      if (dataJson.success && dataJson.results.length > 0) {
        const {
          nombre_persona,
          apellido_paterno_persona,
          apellido_materno_persona,
          nro_tarjeta,
          id_persona,
        } = dataJson.results[0];

        setUser({
          nombre_persona,
          apellido_paterno_persona,
          apellido_materno_persona,
          nro_tarjeta,
          id: id_persona,
        });
        setRespNFC(true);
      } else {
        Alert.alert(
          'Error',
          'el codigo de tarjeta no pertenece a ninguna persona registrada.',
          [{text: 'ok'}],
        );
        helperCloseModal();
      }
    } catch (ex) {
      Alert.alert(
        '!Ups¡',
        'Ocurrio un problema de conexion, verifiquela e intente de nuevo.',
        [{text: 'ok'}],
      );
      helperCloseModal();
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const addUserToRecords = () => {
    setUsers(prevState => [...prevState, {...user}]);
    helperCloseModal();
  };

  useEffect(() => {
    if (mostrarModal) {
      getDataNFC();
    }
  }, [mostrarModal]);

  return (
    <Modal visible={mostrarModal} transparent animationType="fade">
      <View style={styles.wrapperModal}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={helperCloseModal} style={styles.btnClose}>
            <Image
              style={styles.imageClose}
              source={require('../Assets/img/closeModal.png')}
            />
          </TouchableOpacity>
          {respNFC ? (
            <View style={styles.wrapperUsrData}>
              <Text style={styles.text}>
                {user.nombre_persona} {user.apellido_paterno_persona}{' '}
                {user.apellido_materno_persona}
              </Text>
              <Text style={styles.text}>NFC: {user.nro_tarjeta}</Text>
              <View style={styles.wrapperImgUsr}>
                <Image
                  style={styles.imageUsr}
                  source={require('../Assets/img/ImageUserModal.png')}
                />
              </View>

              <TouchableOpacity
                onPress={addUserToRecords}
                style={styles.btnAddUser}>
                <Text style={styles.textBtnAddUser}>REGISTRAR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.wrapperActInd}>
              <Text style={styles.textActInd}>
                Escaneando NFC, por favor acerque la credencial
              </Text>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapperModal: {
    height: '100%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22,29,47,0.5)',
  },
  modal: {
    width: '90%',
    height: '70%',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  btnClose: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  imageClose: {
    width: 60,
    height: 60,
    tintColor: '#e96b62',
  },
  text: {
    fontSize: 24,
    color: '#000',
    margin: 10,
    textAlign: 'center',
  },
  wrapperUsrData: {
    alignItems: 'center',
    marginVertical: 5,
  },
  imageUsr: {
    width: 210,
    height: 210,
  },
  wrapperImgUsr: {
    borderWidth: 1,
    borderRadius: 200,
    borderWidth: 5,
  },
  btnAddUser: {
    borderWidth: 1,
    width: '60%',
    backgroundColor: '#306097',
    marginVertical: 15,
    borderRadius: 5,
  },
  textBtnAddUser: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
  },
  wrapperActInd: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textActInd: {
    fontSize: 24,
    textAlign: 'center',
    color: '#878787',
    marginVertical: 10,
  },
});

export default ModalAddUser;
