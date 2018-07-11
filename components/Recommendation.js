
import React, { Component } from 'react';

import MapView from 'react-native-maps';
import { Card, Image, View, Subtitle, Text, Caption } from '@shoutem/ui';


class Recommendation extends Component {
    get photo() {
        const photo = this.props.venue.photos.groups[0].items[0];

        return `${photo.prefix}300x500${photo.suffix}`;
    }

    // fetch directions and decode polylines
async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        this.setState({coords: coords})
        return coords
    } catch(error) {
        return error
    }
}

    render() {
        const { venue, tips } = this.props;

        return (

            <MapView style={styles.map} initialRegion={{
                latitude:41.0082, 
                longitude:28.9784, 
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}>
        
              <MapView.Polyline 
                  coordinates={this.state.coords}
                  strokeWidth={2}
                  strokeColor="red"/>
              </MapView>
              
            <MapView.Marker coordinate={{latitude: venue.location.lat,
                                         longitude: venue.location.lng}}>

                <MapView.Callout>
                    <Card>
                        <Image styleName="medium-wide"
                               source={{uri: this.photo}} />
                        <View styleName="content">
                            <Subtitle>{venue.name}</Subtitle>
                            <Caption>{tips ? tips[0].text : ''}</Caption>
                        </View>
                    </Card>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
}

export default Recommendation;
