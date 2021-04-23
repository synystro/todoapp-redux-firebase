import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Provider} from 'react-redux';

import Login from './src/screens/TodoLogin';
import TodoList from './src/screens/TodoList';
import TodoAdd from './src/screens/TodoAdd';
import TodoEdit from './src/screens/TodoEdit';

const Stack = createStackNavigator();

import configureStore from './src/redux/store';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
  <NavigationContainer>
    <Stack.Navigator>
      {  <Stack.Screen
        name = 'Login'
        component={Login}
        options={
      {
        title: 'Login',
        headerTintColor: 'orange',
        headerStyle: {backgroundColor: 'black'}
      }}
      />
      }
      <Stack.Screen
        name="TodoList"
        component={TodoList}
        options={{
			    title: 'My Todos',
        	headerTintColor: 'orange',
        	headerStyle: { backgroundColor: 'black' }
        }}
      />
      <Stack.Screen
        name="TodoAdd"
        component={TodoAdd}
        options={{
			title: 'New Todo',
        	headerTintColor: 'orange',
        	headerStyle: {
            backgroundColor: 'black'
          }
        }}
      />
      <Stack.Screen
        name="TodoEdit"
        component={TodoEdit}
        options={{
			title: 'Edit Todo',
        	headerTintColor: 'orange',
        	headerStyle: {
            backgroundColor: 'black'
          }
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  </Provider>
    )
  }
}