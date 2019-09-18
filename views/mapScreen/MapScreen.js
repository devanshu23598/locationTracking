import React, { Component } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'native-base';
import { Text,View,Dimensions} from 'react-native';
export default class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: this.props.navigation.state.params.latitude,
                longitude: this.props.navigation.state.params.longitude,
                latitudeDelta: this.props.navigation.state.params.latitudeDelta,
                longitudeDelta: this.props.navigation.state.params.longitudeDelta,
            },
            marker: {
                latitude: this.props.navigation.state.params.latitude,
                longitude: this.props.navigation.state.params.longitude,
            }
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView style={{ flex: 1 }} initialRegion={this.state.region}  >
                    <Marker coordinate={this.state.marker} />

                </MapView>
                <Button style={{ backgroundColor: 'black', opacity: 1,justifyContent:'center',marginBottom:5,width:Dimensions.get('screen').width-60,alignSelf:'center' }} onPress={() => { this.props.navigation.navigate('HomeScreen') }}>
                    <Text style={{ color: "white" }}>Go back to home screen</Text>
                </Button>
            </View>


        )
    }
}
