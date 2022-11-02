import { NativeModules } from "react-native";

export default NativeModules.webView as {
    onCreateWebView<T>(url: string, isWebView: boolean): Promise<T>
}