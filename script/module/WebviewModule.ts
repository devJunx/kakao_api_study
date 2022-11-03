import { NativeModules } from "react-native";

export default NativeModules.WebViewModule as {
    onCreateWebView<T>(url: string, isWebView: boolean): Promise<T>
}