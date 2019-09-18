import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text, Button, Body } from 'native-base';
import * as firebase from 'firebase';
import { View, StatusBar, StyleSheet } from 'react-native';
export default class mySavedLocation extends Component {
    state = {
        locations: []
    }
    componentWillMount() {
        var mySavedLocation = firebase.database().ref('/');
        mySavedLocation.once('value').then(data => {
            this.storevalue(data.val())
        })
    }
    storevalue = (v) => {
        var myarr = [];
        for (var key in v) {
            myarr.push(v[key]);
        }
        this.setState({
            locations: myarr
        })
    }
    regionFrom=(lat, lon, accuracy)=> {
        var oneDegreeOfLongitudeInMeters = 111.32 * 1000;
        var circumference = (40075 / 360) * 1000;
    
        var latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
        var lonDelta = (accuracy / oneDegreeOfLongitudeInMeters);
         var latDelta= Math.max(0, latDelta);
         var lonDelta=Math.max(0, lonDelta);
         this.props.navigation.navigate('MapView',{
            latitude:lat,
            longitude:lon,
            latitudeDelta:latDelta,
            longitudeDelta:lonDelta                        
        }) 

      }

    render() {
        return (
            <Container>
                <View style={styles.header} />
                <StatusBar backgroundColor="#000" />
                <Header style={{ backgroundColor: "#6a63dd" }}>
                    <Body>
                        <Text style={styles.headerText}>My Saved locations</Text>
                    </Body>
                </Header>
                <Content>
                    <List>
                        {
                            this.state.locations.map((v, i) => {
                                return (
                                    <ListItem style={styles.lisItemContainer} key={i}>
                                        <Text style={styles.textParent}>Longitude: <Text style={styles.textChild}>{v.longitude}</Text></Text>
                                        <Text style={styles.textParent}>Latitude: <Text style={styles.textChild}>{v.latitude}</Text></Text>
                                        <Text style={styles.textParent}>Time Stamp: <Text style={styles.textChild}>{v.timestamp}</Text></Text>
                                        <Button rounded success style={{marginTop:5,height:40,backgroundColor:'#6a63dd',color:"#6a63dd"}} color="black" onPress={() => { this.regionFrom(v.longitude,v.latitude,v.accuracy)}}>
                                            <Text style={styles.buttonTextStyles}>View in map</Text>
                                        </Button>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <Button rounded success style={styles.buttonStyle} onPress={() => { this.props.navigation.navigate('HomeScreen') }}>
                        <Text style={styles.buttonTextStyles}>Go to homescreen</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "black",
        height: 30,
    },
    headerText: { color: 'white' },
    lisItemContainer: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
    textParent: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', color: "#ee79bd" },
    textChild: { fontSize: 14, fontWeight: '400' },
    buttonStyle: { padding: 10, width: 230, alignSelf: 'center', marginTop: 50, elevation: 1, marginBottom: 15, backgroundColor: "#6a63dd" },
    buttonTextStyles: { color: 'white', letterSpacing: 1 }
})