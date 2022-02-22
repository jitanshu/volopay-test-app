import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Share
} from "react-native";
import * as Api from '../common/apiList'
import * as Colors from '../common/colors'

class GifComponent extends Component {

    onShare = async () => {
        const { imgUrl } = this.props
        try {
            const result = await Share.share({
                title: 'Check it!',
                message: imgUrl,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        const { imgUrl, title, date } = this.props
        return (
            <TouchableOpacity onPress={() => this.onShare()} activeOpacity={0.3} style={styles.container}>
                <Text style={styles.dateText}>{date ? date : ''}</Text>
                <Image style={styles.imageStyle} source={{ uri: imgUrl ? imgUrl : Api.dummyImg }} />
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle} numberOfLines={2}>{title ? title : ''}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
export default GifComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 10,
        width: '45%',
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: Colors.white
    },
    dateText: {
        color: '#F1C40F',
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 999,
        fontSize: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontWeight: 'bold'
    },
    imageStyle: {
        borderRadius: 10,
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        backgroundColor: Colors.white
    },
    titleContainer: {
        width: '100%',
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 12,
        lineHeight: 15,
        color: Colors.black,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        height: 50
    },
});