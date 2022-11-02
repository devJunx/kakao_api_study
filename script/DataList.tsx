import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, ToastAndroid, TouchableWithoutFeedback, Linking } from 'react-native';
import NetworkModule from './module/NetworkModule';

const DATA = [{ id: '0', title: '책 이름', authors: '저자', url: 'https://namu.wiki/w/%EC%B1%85' }]
interface IKakaoNetwork {
    get<T = string>(
        url: string,
        root: string,
        query: string,
        encode?: boolean
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
                    !isNotShowingIndicator && reject(error)
                })
                .finally(() => {
                    if (!isNotShowingIndicator) {
                        --connectionCount

                        setTimeout(() => {
                            connectionCount < 1 && LoadingIndicatorManager.close()
                        }, 100)
                    }
                })
        })

    },
}

const bookSearch = async (query: any) => {
    // let url =
    // 'https://dapi.kakao.com/v3/search/book?query=' + query + '&size=1&page=1&target=title';
    // console.log('test: ', encodeURI(url))
    return KakaoNetwork.get('https://dapi.kakao.com', '/v3/search/book?', encodeURI(query))
        .then((res: any) => {
            console.log(res)
            // console.log('test:', res)
            // console.log(typeof res)
            DATA[DATA.length] = {
                id: DATA.length.toString(),
                title: res.documents[0].title,
                authors: res.documents[0].authors,
                url: res.documents[0].url
            }
            // console.log(DATA[1].url)
        })
        .catch((error: string) => console.log('error:', error))
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightblue',
        width: '100%',
        height: '100%'
    },
    item: {
        backgroundColor: 'skyblue',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row'
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
        <TouchableWithoutFeedback onPress={() => Linking.openURL(DATA[id].url)}>
            <View style={styles.item}>
                <Text style={titleSize}>{title}</Text>
                <Text style={titleSize}>({author})</Text>
            </View>
        </TouchableWithoutFeedback>
    )
};
const DataList = () => {
    const renderItem = ({ item }) => (
        <Item id={item.id} title={item.title} author={item.authors.length > 1 && typeof item.authors == "object" ? item.authors[0] : item.authors}/>
    );
    const [input, setInput] = React.useState('')

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} onChangeText={(text: any) => setInput(text)} />
            <Button title='책 검색' onPress={() => { bookSearch(input) }} />
            <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 10 }}>작가가 2명 이상시 1명만 표시</Text>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id} />
        </View>
    )
}
export default DataList

//