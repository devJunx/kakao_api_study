import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, ToastAndroid, TouchableWithoutFeedback, Image, Dimensions, Alert } from 'react-native';
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
                    .then(resolve)
                    .catch(error => {
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
        backgroundColor: '#F4F4F4',
        width: '100%',
        height: '100%'
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 13,
    },
    search: {
        borderRadius: 3,
        backgroundColor: '#EBEBEB',
        margin: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    infoView: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    }
})
const KAKAO_BASE_URL = 'https://dapi.kakao.com'
const BookSearch = async (query: string) => {
    const saleRegex = /\B(?=(\d{3})+(?!\d))/g
    const putData = (res: any) => {
        for (let i = 0; i < 5; i++) {
            const sale_price = res.documents[i].sale_price.toString().replace(saleRegex, ",") + '원'
            const authors = res.documents[i].authors.length > 0 ? res.documents[i].authors[0] : '작가 없음'
            State.BookData.push({
                id: State.BookData.length.toString(),
                title: res.documents[i].title.toString(),
                authors: authors,
                url: res.documents[i].url,
                sale_price: res.documents[i].sale_price < 0 ? '품절' : sale_price,
                thumbnail: res.documents[i].thumbnail,
                publisher: res.documents[i].publisher
            })
        }
    }
    return KakaoNetwork.get(KAKAO_BASE_URL, '/v3/search/book?', encodeURI(query))
        .then((res: any) => {
            if (res.meta.pageable_count != 0) {
                putData(res)
            } else {
                ToastAndroid.show("검색하신 키워드의 책이 안 보입니다.", ToastAndroid.SHORT)
            }
        })
        .catch((error: string) => console.log(error))
};
const Item = ({ id, title, author, sale_price, thumbnail, publisher }) => {
    // const isShowURL = () => { Alert.alert("이 책 보기", "이 책 관련해서 정보를 알려드릴까요", [{ text: "예", onPress: () => Alert.alert("정보 보기 유형", "", [{ text: "웹 브라우저", onPress: () => Linking.openURL(state.data[id].url) }, { text: "앱에서", onPress: () => onCreateWeb(state.data[id].url) }]) }, { text: "아니오" }]) }
    const titleStyle = [styles.title, { color: '#808080', width: 60 }]
    const infoViewStyle = styles.infoView
    const isThumbnail = thumbnail != "" ? thumbnail : 'https://search1.kakaocdn.net/thumb/C216x312.q85/?fname=https://i1.daumcdn.net/imgsrc.search/search_all/noimage_grid4.png'
    const isSubString = (start: any, end: any) => { return publisher.substring(start, end) }
    const isPublisher = publisher.includes('(') ? isSubString(0, publisher.indexOf('(')) : (publisher.includes(' ') ? isSubString(0, publisher.indexOf(' ')) : publisher)
    return (
        <TouchableWithoutFeedback onPress={() => Alert.alert("책 보기", title + "의 정보를 볼건가요?", [{ text: "취소" }, { text: "확인", onPress: () => onCreateWeb(State.BookData[id].url) }])} onLongPress={() => Alert.alert("삭제", "삭제하시겠습니까?", [{ text: "예", onPress: () => State.BookData.splice(parseInt(id), 1) }, { text: "아니오" }])}>
            <View style={styles.item}>
                <Image style={{ width: 100, height: 100, marginRight: 15, backgroundColor: 'white', borderRadius: 30, borderWidth: 1 }} source={{ uri: isThumbnail }} />
                <View style={{ width: (Dimensions.get('screen').width - 50) / 2, justifyContent: 'center' }}>
                    <View style={infoViewStyle}>
                        <Text style={{ fontSize: 15 }}>{title}</Text>
                    </View>
                    <View style={infoViewStyle}>
                        <Text style={titleStyle}>저자</Text>
                        <Text style={[styles.title, { color: 'blue' }]}>{author}</Text>
                    </View>
                    <View style={infoViewStyle}>
                        <Text style={titleStyle}>출판</Text>
                        <Text style={[styles.title, { color: 'blue' }]}>{isPublisher}</Text>
                    </View>
                    <View style={infoViewStyle}>
                        <Text style={titleStyle}>판매가</Text>
                        <Text style={{ marginRight: 8, borderWidth: 1, borderColor: 'lightgray', backgroundColor: 'white', textAlign: 'center', paddingHorizontal: 3, color: 'black' }}>서적</Text>
                        <Text style={[styles.title, { color: 'red' }]}>{sale_price}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};
const State = {
    BookData: [{
        id: '0',
        title: '책',
        authors: '김영준',
        url: 'https://namu.wiki/w/%EC%B1%85',
        sale_price: '0원',
        thumbnail: 'https://w.namu.la/s/5aed1de3e76dd5a0fa9185a3523182ecd66873d77fb7261c9cea9398eac1af1423a74a3557dd4679fffa6ca0e16c604c576489cd3b37b9db5a6adcaa65341cb07cfa72a94e4637824a01de269d81ab1ed198a8366740d2b8bf0881296ffdd7ae706491bce78fc16f34b364e8682fc4e6',
        publisher: '어떤컴퍼니'
    }],
    item: 1
}
const DataList = () => {
    const renderItem = ({ item }) => {
        return <Item id={item.id} title={item.title} author={item.authors != '' ? item.authors : '작가 없음'} sale_price={item.sale_price} thumbnail={item.thumbnail} publisher={item.publisher} />
    };
    const [input, setInput] = React.useState('')

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <TextInput style={{ width: 320, height: 45, textAlignVertical: 'center' }} onChangeText={(text: any) => { setInput(text) }} value={input} />
                <TouchableWithoutFeedback onPress={() => BookSearch(input)} onLongPress={() => setInput('')}>
                    <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/7.7.0/png/iconmonstr-magnifier-lined.png&r=0&g=0&b=0' }} />
                </TouchableWithoutFeedback>
            </View>
            {input != '' &&
                <FlatList
                    style={{ borderRadius: 5 }}
                    data={State.BookData}
                    onEndReachedThreshold={1}
                    onScrollEndDrag={() => { BookSearch(input) }}
                    renderItem={renderItem} />
            }
        </View>
    )
}
export default DataList;