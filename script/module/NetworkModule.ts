import { NativeModules } from "react-native";

export default NativeModules.NetworkModule as {
    onRequest<T>(
        url: string,
        root: string,
        query: string
    ): Promise<T>,
    test(): Promise<void>
}


