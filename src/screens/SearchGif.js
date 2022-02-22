
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    FlatList,
    ActivityIndicator
} from "react-native";
import * as Colors from '../common/colors'
import * as Api from '../common/apiList'
import GifComponent from "../components/GifComponent";
import moment from "moment";

class SearchGif extends Component {

    constructor(props) {
        super(props)
        this.state = {
            limit: 20,
            offset: 0,
            data: [],
            onEndReachedCalledDuringMomentum: true,
            total_page: 1,
            search_total_page: 1,
            page: 1,
            search_page: 1,
            footer_loading: false,
            search_text: '',
            search_loading: false,
        }
    }

    componentDidMount() {
        this.getGif()
    }

    getGif = () => {
        const { limit, offset, data, page } = this.state
        const url = Api.getGifApi + `&limit=${limit}&offset=${offset}`
        fetch(url, { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    footer_loading: false
                })
                const resp_data = responseJson && responseJson.data ? responseJson.data : []
                const resp_pagination = responseJson && responseJson.pagination ? responseJson.pagination : {}
                const count = resp_pagination && resp_pagination.count ? resp_pagination.count : 0
                const total = resp_pagination && resp_pagination.total_count ? resp_pagination.total_count : 0
                this.setState({
                    total_page: parseInt(total / count),
                    limit: count
                })
                this.setState({
                    data: page > 1 ? data.concat(resp_data) : resp_data,
                })
            })
            .catch(err => {
                const msg = err && err.message ? err.message : 'Something went wrong!'
                alert(msg)
            })
    }

    search = async (value) => {
        this.setState({
            search_text: value,
        })
        if (value.length > 0) {
            this.searchGif(value)
        } else {
            this.setState({
                search_page: 1,
                page: 1,
                total_page: 1,
                search_total_page: 1,
                offset: 0,
                limit: 20,
                data: []
            })
            await this.getGif()
        }
    }

    searchGif = (text) => {
        const { limit, offset, data, footer_loading, search_page, search_text } = this.state
        const url = Api.searchGifApi + `&limit=${limit}&offset=${offset}&q=${text}`
        if (!footer_loading) {
            this.setState({
                search_loading: true
            })
        }
        fetch(url, { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    footer_loading: false,
                    search_loading: false
                })
                const resp_data = responseJson && responseJson.data ? responseJson.data : []
                const resp_pagination = responseJson && responseJson.pagination ? responseJson.pagination : {}
                const count = resp_pagination && resp_pagination.count ? resp_pagination.count : 0
                const total = resp_pagination && resp_pagination.total_count ? resp_pagination.total_count : 0
                this.setState({
                    search_total_page: parseInt(total / count),
                    limit: count
                })
                this.setState({
                    data: search_page > 1 ? data.concat(resp_data) : resp_data,
                })
            })
            .catch(err => {
                const msg = err && err.message ? err.message : 'Something went wrong!'
                alert(msg)
            })
    }

    loadMore = () => {
        const { footer_loading, onEndReachedCalledDuringMomentum, page, total_page, search_text, search_page, search_total_page, limit } = this.state

        if (footer_loading === true) {
            return null
        }
        if (!onEndReachedCalledDuringMomentum) {
            if (search_text && search_page < search_total_page) {
                this.setState({
                    footer_loading: true,
                    search_page: search_page + 1,
                    offset: (search_page * limit) + 1
                })
                this.searchGif(search_text)
                this.setState(prevState => ({
                    onEndReachedCalledDuringMomentum: true,
                }));
            } else if (page < total_page) {
                this.setState({
                    footer_loading: true,
                    page: page + 1,
                    offset: (page * limit) + 1,
                })
                this.getGif()
                this.setState(prevState => ({
                    onEndReachedCalledDuringMomentum: true,
                }));
            }

        }
    }


    render() {
        const { data, footer_loading, search_loading } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topBg} />
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}><Text style={{ color: Colors.red }}>G </Text>I P H Y</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        onChangeText={(value) => {
                            this.search(value)
                        }}
                        placeholder="Search anything..."
                        placeholderTextColor={Colors.gray}
                        style={styles.searchInput} />
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={{ marginTop: 10 }}
                        ListHeaderComponent={
                            search_loading ?
                                <View>
                                    <ActivityIndicator animating={search_loading} size="small" color={Colors.black} />
                                </View> : null
                        }
                        contentContainerStyle={{ paddingBottom: '30%' }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.9}
                        onMomentumScrollBegin={() => {
                            this.setState({
                                onEndReachedCalledDuringMomentum: false,
                            });
                        }}
                        ListFooterComponent={
                            <View>
                                <ActivityIndicator animating={footer_loading} size="small" color={Colors.black} />
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <GifComponent
                                    date={item && item.import_datetime ? moment(item.import_datetime).format('DD/MMM/YYYY') : ''}
                                    imgUrl={item && item.images ? item.images && item.images.downsized ? item.images.downsized.url ? item.images.downsized.url : '' : '' : ''}
                                    title={item.title} />
                            )
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default SearchGif;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    headerContainer: {
        paddingTop: '5%',
    },
    headerText: {
        color: Colors.black,
        fontSize: 24
    },
    bodyContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
    },
    searchInput: {
        borderColor: Colors.gray,
        borderWidth: 0.5,
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    topBg: {
        width: '100%',
        padding: 30,
        backgroundColor: 'rgba(70,10,10,0.2)',
        position: 'absolute',
        top: 0,
        zIndex: -999,
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50
    }
});