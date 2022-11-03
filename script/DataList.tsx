import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, ToastAndroid, TouchableWithoutFeedback } from 'react-native';
import NetworkModule from './module/NetworkModule';
import WebviewModule from './module/WebviewModule';

const DATA = [{ id: '0', title: '예시책', authors: '예시저자', url: 'https://namu.wiki/w/%EC%B1%85' }]

interface IKakaoNetwork {
    get<T = string>(
        url: string,
        root: string,
        query: string,
        encode?: boolean
    )
}
interface WebView{
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
    view<T=string>(url: string, isWebView: boolean): Promise<T>{
    return new Promise((resolve, reject) => {
            if(isWebView){
                WebviewModule.onCreateWebView<T>(url, true)
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
        .then((res: any) => {
            console.log(res)
        })
        .catch((error: string) => console.log(error))
}

const bookSearch = async (query: any) => {
    // let url =
    // 'https://dapi.kakao.com/v3/search/book?query=' + query + '&size=1&page=1&target=title';
    // console.log('test: ', encodeURI(url))
    return KakaoNetwork.get('https://dapi.kakao.com', '/v3/search/book?', encodeURI(query))
        .then((res: any) => {
            if(res.meta.pageable_count != 0){
                for(let i = 0; i<res.documents.length; i++){
                    DATA[DATA.length] = {
                        id: DATA.length.toString(),
                        title: res.documents[i].title,
                        authors: res.documents[i].authors.length > 1 ? res.documents[i].authors[0] : res.documents[i].authors,
                        url: res.documents[i].url
                    }
                }
            } else{
                ToastAndroid.showWithGravity("검색하신 키워드의 책이 안 보입니다.", ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
        })
        .catch((error: string) => console.log(error))
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7dfb0',
        width: '100%',
        height: '100%'
    },
    item: {
        backgroundColor: '#FCB837',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        margin: 5
    }
})



const Item = ({ id, title, author }) => {
    const titleSize = (title + author).length < 15 ? styles.title : { fontSize: 15 }
    return (
        <TouchableWithoutFeedback onPress={() => onCreateWeb(DATA[id].url)}>
            <View style={styles.item}>
                <Text style={titleSize}>책이름: {title}</Text>
                <Text style={titleSize}>저자: {author}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
};
const DataList = () => {
    const renderItem = ({ item }) => (
        <Item id={item.id} title={item.title} author={item.authors.length > 0 ? item.authors : "작가를 모르겠습니다."}/>
    );
    const [input, setInput] = React.useState('')
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} onChangeText={(text: any) => setInput(text)} />
            <Text style={{backgroundColor: '#e89e0e', color: 'white', textAlign: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 5}} onPress={() => { bookSearch(input)}}>책검색</Text>
            {/* <Button title='책 검색' onPress={() => { bookSearch(input) }}/> */}
            <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 10 }}>작가가 2명 이상시 1명만 표시</Text>
            <FlatList
                data={DATA}
                renderItem={renderItem} />
        </View>
    )
}
export default DataList;