import 'react-native-gesture-handler';
import React, {useMemo, useReducer} from 'react';
import UserReducer from './Assets/UserReducer';
import UserContext from './Assets/UserContext';
import LoginScreen from './Views/LoginScreen';
import HomeScreen from './Views/HomeScreen';
import ScreenLoading from './Views/ScreenLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  loggedIn: false,
  loading: false,
};

const App = () => {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const authContext = useMemo(
    () => ({
      login: string => dispatch({type: 'login', payload: string}),
      loading: () => dispatch({type: 'loading'}),
      logout: async () => {
        await AsyncStorage.setItem('log', '');
        dispatch({type: 'logout'});
      },
    }),
    [],
  );

  if (state.loading) {
    return <ScreenLoading />;
  }
  return (
    <UserContext.Provider value={authContext}>
      {state.loggedIn ? <HomeScreen /> : <LoginScreen />}
    </UserContext.Provider>
  );
};

export default App;
