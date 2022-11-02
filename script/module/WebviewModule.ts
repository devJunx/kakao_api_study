import { NativeModules } from "react-native";

export default NativeModules.WebviewModule as {
    onCreateWebView<T>(url: string, isWebView: boolean): Promise<T>
}