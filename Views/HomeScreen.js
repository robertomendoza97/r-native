import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterVehicle from './RegisterVehicle';
import Search from './Search';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  Search.navigationOptions = {
    headerTitle: 'Pantalla de camiones',
    headerLeft: () => {
      return null;
    },
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Inicio"
          component={RegisterVehicle}
          options={{
            title: 'REGISTRAR',
            headerStyle: {backgroundColor: '#004174'},
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            title: 'BUSCAR REGISTROS',
            headerStyle: {backgroundColor: '#004174'},
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeScreen;
