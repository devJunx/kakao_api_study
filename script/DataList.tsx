import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, ToastAndroid, TouchableWithoutFeedback, Alert, Linking, Image, Dimensions, ScrollView } from 'react-native';
import NetworkModule from './module/NetworkModule';
import WebviewModule from './module/WebviewModule';


interface IKakaoNetwork {
    get<T = string>(
        url: string,
        root: string,
        query: string,
        encode?: boolean
    )
}
interface WebView {
    view<T = string>(
        url: string,
        isWebView: boolean
    )
}
var connectionCount = 0
interface IndicatorInterface {
    show(): void
    close(): void
}
const LoadingIndicatorManager: IndicatorInterface = {
    show: () => { },
    close: () => { },
}

export const KakaoNetwork: IKakaoNetwork = {
    get<T = string>(
        url: string,
        root: string,
        query: string,
        isNotShowingIndicator: boolean = false
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!isNotShowingIndicator) {
                connectionCount++
                LoadingIndicatorManager.show()
            }
            NetworkModule.onRequest<T>(url, root, query)
                .then(resolve)
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        })

    },
}


const OnWebView: WebView = {
    view<T = string>(url: string, isWebView: boolean): Promise<T> {
        return new Promise((resolve, reject) => {
            if (isWebView) {
                WebviewModule.onCreateWebView<T>(url)
                    .then(resolve => {console.log(resolve)})
                    .catch(error => {
                        console.log(error)
                        reject(error)
                    })
            }
        })
    }
}
const onCreateWeb = (viewUrl: string) => {
    return OnWebView.view(viewUrl, true)
        .then()
        .catch((error: string) => console.log(error))
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7dfb0',
        width: '100%',
        height: '100%'
    },
    item: {
        backgroundColor: '#FCB837',
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
        flexDirection: 'row',
    },
    title: {
        fontSize: 13,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FCB837',
        paddingLeft: 10,
        margin: 16
    },
    infoView: {
        flexDirection: 'row',
        marginTop: 5
    }
})



const Item = ({ id, title, author, sale_price, thumbnail, publisher }) => {
    // const isShowURL = () => { Alert.alert("이 책 보기", "이 책 관련해서 정보를 알려드릴까요", [{ text: "예", onPress: () => Alert.alert("정보 보기 유형", "", [{ text: "웹 브라우저", onPress: () => Linking.openURL(state.data[id].url) }, { text: "앱에서", onPress: () => onCreateWeb(state.data[id].url) }]) }, { text: "아니오" }]) }
    const titleStyle = [styles.title, { color: '#808080', width: 60 }]
    const infoViewStyle = styles.infoView
    const isThumbnail = thumbnail != "" ? thumbnail : 'https://search1.kakaocdn.net/thumb/C216x312.q85/?fname=https://i1.daumcdn.net/imgsrc.search/search_all/noimage_grid4.png'
    return (
        // <TouchableWithoutFeedback onPress={isShowURL}>
        <ScrollView style={styles.item} horizontal={true} onTouchStart={() => onCreateWeb(state.data[id].url)}>
            <Image style={{ width: (Dimensions.get('screen').width / 2.5), height: '100%', marginRight: 15, backgroundColor: 'white' }} source={{ uri: isThumbnail }} />
            <View style={{ width: (Dimensions.get('screen').width - 50) / 2, justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
                <View style={infoViewStyle}>
                    <Text style={titleStyle}>저자</Text>
                    <Text style={[styles.title, { color: 'blue' }]}>{author}</Text>
                </View>
                <View style={infoViewStyle}>
                    <Text style={titleStyle}>출판</Text>
                    <Text style={[styles.title, { color: 'blue' }]}>{publisher}</Text>
                </View>
                <View style={infoViewStyle}>
                    <Text style={titleStyle}>판매가</Text>
                    <Text style={{ marginRight: 8, borderWidth: 1, borderColor: 'lightgray', backgroundColor: 'white', textAlign: 'center', paddingHorizontal: 3 }}>서적</Text>
                    <Text style={[styles.title, { color: 'red' }]}>{sale_price}</Text>
                </View>
            </View>
        </ScrollView>
        // </TouchableWithoutFeedback>
    )
};

const state = {
    data: [{
        id: '0',
        title: '책이름',
        authors: '김영준',
        url: 'https://namu.wiki/w/%EC%B1%85',
        sale_price: '0원',
        thumbnail: 'https://w.namu.la/s/5aed1de3e76dd5a0fa9185a3523182ecd66873d77fb7261c9cea9398eac1af1423a74a3557dd4679fffa6ca0e16c604c576489cd3b37b9db5a6adcaa65341cb07cfa72a94e4637824a01de269d81ab1ed198a8366740d2b8bf0881296ffdd7ae706491bce78fc16f34b364e8682fc4e6',
        publisher: '어떤컴퍼니'
    }],
    item: 1
}
const bookSearch = async (query: string, isScroll?: boolean) => {
    const saleRegex = /\B(?=(\d{3})+(?!\d))/g
    // let url =
    // 'https://dapi.kakao.com/v3/search/book?query=' + query + '&size=1&page=1&target=title';
    // console.log('test: ', encodeURI(url)))
    const putData = (res: any) => {
        for (let i = 0; i < 5; i++) {
            const sale_price = res.documents[i].sale_price.toString().replace(saleRegex, ",") + '원'
            const authors = res.documents[i].authors[0].split(' ')
            state.data.push({
                id: state.data.length.toString(),
                title: res.documents[i].title.toString(),
                authors: authors[0],
                url: res.documents[i].url,
                sale_price: res.documents[i].sale_price < 0 ? '품절' : sale_price,
                thumbnail: res.documents[i].thumbnail,
                publisher: res.documents[i].publisher
            })
        }
    }
    return KakaoNetwork.get('https://dapi.kakao.com', '/v3/search/book?', encodeURI(query))
        .then((res: any) => {
            if (res.meta.pageable_count != 0) {
                if (isScroll == true) {
                    putData(res)
                } else {
                    putData(res)
                }
            } else {
                ToastAndroid.show("검색하신 키워드의 책이 안 보입니다.", ToastAndroid.SHORT)
            }
        })
        .catch((error: string) => console.log(error))
};

const DataList = () => {
    const renderItem = ({ item }) => (
        <Item id={item.id} title={item.title} author={item.authors.length > 0 ? item.authors : "작가를 모르겠습니다."} sale_price={item.sale_price} thumbnail={item.thumbnail} publisher={item.publisher} />
    );
    const [input, setInput] = React.useState('')
    
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} onChangeText={(text: any) => { setInput(text) }} />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, backgroundColor: '#e89e0e', color: 'white', textAlign: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 16 }} onPress={() => { bookSearch(input) }}>책검색</Text>
                <Text style={{ flex: 1, backgroundColor: '#e89e0e', color: 'white', textAlign: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 16 }} onPress={() => { state.data.splice(1, state.data.length) }}>검색 목록 삭제</Text>
            </View>
            {/* <Button title='책 검색' onPress={() => { bookSearch(input) }}/> */}
            <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 10 }}>작가가 2명 이상시 1명만 표시</Text>
            <FlatList
                data={state.data}
                onEndReachedThreshold={1}
                onScrollEndDrag={() => { bookSearch(input, true) }}
                renderItem={renderItem} />
        </View>
    )
}
export default DataList;