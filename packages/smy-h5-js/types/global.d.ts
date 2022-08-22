export {};

declare global {
  const _hmt: string[][];
  const webkit: any;
  const SMYJSInterface: Record<import('../src/utils').SmyInterfaceKey, import('../src/utils').SmyInterfaceValue>;
  const SMYJS: import('../src').SMYJSType;
  const SERVER_DATA: Record<string, string>;
  /**
   * webview加载完成之后回调
   */
  const smyWebViewDidFinishLoad: () => void;
  /**
   * webview开始之前回调
   * */
  const smyWebViewDidShow: () => void;

  interface Window {
    _hmt: typeof _hmt;
    webkit: typeof webkit;
    SMYJSInterface: typeof SMYJSInterface;
    SMYJS: typeof SMYJS;
    serverData: typeof SERVER_DATA;
    SERVER_DATA: typeof SERVER_DATA;
    smyWebViewDidFinishLoad: typeof smyWebViewDidFinishLoad;
    smyWebViewDidShow: typeof smyWebViewDidShow;
  }
}
