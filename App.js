import React, { Component } from 'react';
import { View, Text,ActivityIndicator } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import HomeScreen from './views/homeScreen/HomeScreen';
import MySavedLocation from './views/mySavedLocation/MySavedLocation';
import * as Font from 'expo-font';
import * as firebase from 'firebase';
import MapScreen from './views/mapScreen/MapScreen';



const firebaseConfig = {
  apiKey: "AIzaSyDUeaTuhHmFpe8t17GLbOllA82IA6OHK-M",
  authDomain: "track-location-2d29c.firebaseapp.com",
  databaseURL: "https://track-location-2d29c.firebaseio.com",
  projectId: "track-location-2d29c",
  storageBucket: "",
  messagingSenderId: "756732065555",
  appId: "1:756732065555:web:c46d0a7eae7e026748cce6"
};

firebase.initializeApp(firebaseConfig)

export default class App extends Component {
  state = {
    isLoaded: false
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ isLoaded: true });
  }


  render() {
    if (this.state.isLoaded) {
      return (
        <AppNavigator/>
      )
    }
    else {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems:'center' }}>
          <ActivityIndicator size="large" color="#ee79bd" />
        </View>
      )
    }
  }


}
const SwitchNavigator = createSwitchNavigator({
  HomeScreen: {
    screen: HomeScreen
  },
  MySavedLocations: {
    screen: MySavedLocation
  },
  MapView:{
    screen:MapScreen
  }
})

const AppNavigator = createAppContainer(SwitchNavigator);