import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { Button, Toast } from 'native-base'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import { Container, Content } from 'native-base'



const GEOLOCATION_OPTIONS = { accuracy: 5, timeInterval: 1000, distanceInterval: 0.00000000001 };

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            text: 'Waiting..',
            timer: null,
            loader: false
        };
    }

    componentWillMount() {

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.loc = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
        this.setState({
            location
        })
    };

    locationChanged = (location) => {
        this.setState({ location })
    }
    regionFrom = (lat, lon, accuracy) => {
        var oneDegreeOfLongitudeInMeters = 111.32 * 1000;
        var circumference = (40075 / 360) * 1000;

        var latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
        var lonDelta = (accuracy / oneDegreeOfLongitudeInMeters);
        var latDelta = Math.max(0, latDelta);
        var lonDelta = Math.max(0, lonDelta);
        this.props.navigation.navigate('MapView', {
            latitude: lat,
            longitude: lon,
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta
        })

    }
    toggleLoader=()=>{
        this.setState({
            loader:!this.state.loader
        })
    }
    saveLocation = () => {
        this.toggleLoader();
        var date = + new Date();
        firebase.database().ref('/' + this.state.location.timestamp).set({
            timestamp: this.state.location.timestamp,
            longitude: this.state.location.coords.longitude,
            latitude: this.state.location.coords.latitude,
            accuracy: this.state.location.coords.accuracy,
            date: date
        }, () => {
            this.toggleLoader();
            Alert.alert("Your location saved successfully")
        });

    }

    render() {
        text = 'Please Wait..';
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            text = '';
        }

        return (

            <View style={styles.container}>
                {
                    this.state.loader
                        ?
                        (<ActivityIndicator size="large" color="white" />)
                        :
                        (
                            <>
                                {
                                    text != '' ?
                                        (<>
                                            <ActivityIndicator size="small" color="#f5f4e9" />
                                        </>)
                                        :
                                        (
                                            <View style={styles.container}>
                                                <View style={{ flex: 0.7, justifyContent: 'center' }}>
                                                    <Text style={styles.textParent}>Latitude: <Text style={styles.textChild}>{this.state.location.coords.latitude}</Text></Text>
                                                    <Text style={styles.textParent}>Longitude: <Text style={styles.textChild}>{this.state.location.coords.longitude}</Text></Text>
                                                </View>
                                                <View
                                                    style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-around', width: Dimensions.get('screen').width }}>
                                                    <Button rounded onPress={() => this.saveLocation()} style={{ padding: 10, backgroundColor: "#ee79bd" }}>
                                                        <Text style={{ color: '#f5f4e9' }}>Save Location</Text>
                                                    </Button>
                                                    <Button rounded success style={{ padding: 10, backgroundColor: "#ee79bd" }} onPress={() => { this.props.navigation.navigate('MySavedLocations') }}>
                                                        <Text style={{ color: '#f5f4e9' }}>My locations</Text>
                                                    </Button>
                                                    <Button rounded success style={{ padding: 10, backgroundColor: "#ee79bd" }} onPress={() => { this.regionFrom(this.state.location.coords.latitude, this.state.location.coords.longitude, this.state.location.coords.accuracy) }}>
                                                        <Text style={{ color: '#f5f4e9' }}>View in map</Text>
                                                    </Button>
                                                </View>
                                            </View>
                                        )
                                }
                            </>
                        )
                }
            </View>
        );
    }



    componentWillUnmount() {
        this.loc.remove();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#6a63dd',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
    },
    textParent: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', color: "#f5f4e9" },
    textChild: { fontSize: 14, fontWeight: '400', color: "#f5f4e9" },
});