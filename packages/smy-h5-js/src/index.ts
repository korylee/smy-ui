// @ts-nocheck
import { APIHost, _SERVER_DATA_ } from "./constant";
import {
  noop,
  isEmail as checkEmail,
  isChineseName as checkChineseName,
  getHeaderSessions,
  getParam,
  replaceParamVal,
  resolveSMYJSINTERFACE,
  compareVersion,
  parseURL,
} from "./utils";
export * from "./utils";

const staticRoot =
  _SERVER_DATA_.staticRoot ||
  (~[
    "https://www.smyfinancial.com",
    "https://wwwjs.smyfinancial.com",
    "https://wwwhb.smyfinancial.com",
  ].indexOf(APIHost)
    ? "https://staticxj.smyfinancial.com/"
    : "//" + location.host + "/static/");

const staticDomain = ~[
  "https://www.smyfinancial.com",
  "https://wwwjs.smyfinancial.com",
  "https://wwwhb.smyfinancial.com",
].indexOf(location.hostname)
  ? staticRoot
  : APIHost + staticRoot;

const isProductEnv = ~[
  "www.smyfinancial.com",
  "wwwjs.smyfinancial.com",
  "wwwjs.szwuyukeji.com",
  "static.smyfinancial.com",
  "staticxj.smyfinancial.com",
  "m.smyfinancial.com",
  "rr.smyfinancial.com",
  "www.szwuyukeji.com",
  "static.szwuyukeji.com",
  "www.hnhxin.com",
  "ipv6.hnhxin.com",
  "static.hnhxin.com",
  "sz.smyfinancial.com",
  "app.szwuyukeji.com",
  "szh.smyfinancial.com",
  "www.shengbeitech.com",
  "static.shengbeitech.com",
  "www.hhbycredit.com",
  "static.hhbycredit.com",
  "www.smydigtech.com",
  "static.smydigtech.com",
].indexOf(location.hostname)
  ? true
  : false;

const ua = navigator.userAgent;

const SMYJS = {
  apihost: APIHost,
  getParam,
  replaceParamVal,
  staticRoot: staticRoot,
  staticDomain: staticDomain,
  env: {
    serverData: _SERVER_DATA_,
    v_public: _SERVER_DATA_.v_public || "",
    staticVersion: _SERVER_DATA_.staticVersion || "",
    isWeixin: ua.match(/MicroMessenger/i) ? true : false,
    isMiniProgram: ua.match(/miniProgram/i) ? true : false,
    isAndroid: ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1,
    isIOS: /(iPhone|iPad|iPod|iOS)/i.test(ua),
    isShengbei: ua.match(/Shengbei\/\S*/g)?.[0].split("/")[1] ?? "", //省呗版本
    shengID: ua.match(/ShengID\/\S*/g) || "", //设备号
    phoneModel:
      ua
        .match(/PhoneModel\/\S*/g)?.[0]
        .split("/")[1]
        .replace(/_/g, " ") ?? "", // 手机型号
    phoneMarker: /(iPhone|iPad|iPod|iOS)/i.test(ua)
      ? "apple"
      : ua.match(/phonemarker\/\S*/gi)?.[0].split("/")[1] ?? "", // 手机品牌
    custOrg: ua.match(/CustOrg\/\S*/g)?.[0].split("/")[1] ?? "", //组织机构号,
    isZb: ua.match(/LoginChannel\/\S*/g)?.[0].split("/")[1] ?? "", //众邦,
    isWeibo: ua.match(/WeiBo/i),
    // todo 后面补充
    isQQInner: false,
    isPC: false,
  },
  isProductEnv,
  loginInfo: {
    uid: getParam("uid") || getHeaderSessions(document.cookie, "smy_app_uid") || "",
    token: getParam("token") || getHeaderSessions(document.cookie, "smy_app_token") || "",
  },
  checkMobileNumber: function (mobile: string) {
    //检测是否合法手机号
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile);
  },
  checkSFZ: function (sfz: string) {
    //检测是否合法身份证
    return /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(
      sfz
    );
  },
  checkChineseName,
  checkEmail,
  compareVersion,
  // 验证码输入去重，兼容IOS剪切板重复输入问题
  uniqueDyCode: function (code: string) {
    // 兼容IOS剪切板重复输入问题，超过8位以上确保不会误判（验证码通常4-6位）
    if (code && code.length >= 8 && code.length % 2 === 0) {
      console.log("验证码去除重复~");
      const index = code.length / 2;
      const str1 = code.substring(0, index);
      const str2 = code.substring(index, code.length);
      if (str1 === str2) {
        //判断是否是相同的重复输入
        code = str1;
      }
    }
    return code;
  },
  //登录失效时调用
  appLogin: function (appCallData) {
    function reUrl(option) {
      const oUrl = location.href.toString();
      let nUrl = oUrl + (location.search ? "" : "?1=1");
      if (nUrl.indexOf("uid") > -1 || nUrl.indexOf("token") > -1) {
        const reID = eval("/(uid=)([^&]*)/gi");
        const reToken = eval("/(token=)([^&]*)/gi");
        nUrl = nUrl.replace(reID, "uid=" + option.userID);
        nUrl = nUrl.replace(reToken, "token=" + option.token);
      } else {
        nUrl = nUrl + "&uid=" + option.userID;
        nUrl = nUrl + "&token=" + option.token;
      }
      return nUrl;
    }
    if (appCallData) {
      if (appCallData.code == 0) {
        const option = appCallData.data;
        location.replace(reUrl(option));
      } else {
        // todo confirm补充
        // @ts-ignored
        SMYJS.confirm?.("登录失败,是否重试?", {
          okFunc() {
            window.SMYJSInterface.appLogin("SMYJS.appLogin");
          },
        });
      }
    } else {
      window.SMYJSInterface.appLogin("SMYJS.appLogin");
    }
  },
  //已登录或不知道是否登录失效获取当前用户登录态
  getSmyUserSession(sessionData) {
    if (sessionData) {
      return sessionData.data.userID + "&" + sessionData.data.token;
    }
  },
  XSS: function (str) {
    str = str || "";
    return (
      str
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;") || ""
    );
  },
  init,
  parseURL,
  openWithoutReferer: function (link) {
    let a = document.createElement("a");
    a.href = link;
    a.rel = "noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
  },
  getHeaderSessions,
  SHA256: function (s) {
    var chrsz = 8;
    var hexcase = 0;
    function safe_add(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
    function S(X, n) {
      return (X >>> n) | (X << (32 - n));
    }
    function R(X, n) {
      return X >>> n;
    }
    function Ch(x, y, z) {
      return (x & y) ^ (~x & z);
    }
    function Maj(x, y, z) {
      return (x & y) ^ (x & z) ^ (y & z);
    }
    function Sigma0256(x) {
      return S(x, 2) ^ S(x, 13) ^ S(x, 22);
    }
    function Sigma1256(x) {
      return S(x, 6) ^ S(x, 11) ^ S(x, 25);
    }
    function Gamma0256(x) {
      return S(x, 7) ^ S(x, 18) ^ R(x, 3);
    }
    function Gamma1256(x) {
      return S(x, 17) ^ S(x, 19) ^ R(x, 10);
    }
    function core_sha256(m, l) {
      var K = new Array(
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0xfc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x6ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
      );
      var HASH = new Array(
        0x6a09e667,
        0xbb67ae85,
        0x3c6ef372,
        0xa54ff53a,
        0x510e527f,
        0x9b05688c,
        0x1f83d9ab,
        0x5be0cd19
      );
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;
      m[l >> 5] |= 0x80 << (24 - (l % 32));
      m[(((l + 64) >> 9) << 4) + 15] = l;
      for (let i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
        for (let j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else
            W[j] = safe_add(
              safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])),
              W[j - 16]
            );
          T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
          T2 = safe_add(Sigma0256(a), Maj(a, b, c));
          h = g;
          g = f;
          f = e;
          e = safe_add(d, T1);
          d = c;
          c = b;
          b = a;
          a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }
    function str2binb(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
      }
      return bin;
    }
    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
    function binb2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i++) {
        str +=
          hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
          hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
      }
      return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
  },
  getBJDateTime: function (dataTime) {
    // 获取北京时区时间（入参：时间戳）
    let BJDateTime;
    try {
      let timezone = 8;
      let offset_GMT = new Date().getTimezoneOffset();
      BJDateTime = new Date(dataTime + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    } catch (e) {
      BJDateTime = new Date(dataTime);
    }
    return BJDateTime;
  },
  openNewWebviewPage(url, needLogin) {
    // 省呗内打开新webview页面
    if (SMYJS.getParam("isTab") || SMYJS.getParam("qd") == "tab") {
      return (location.href = url);
    }
    if (SMYJS.compareVersion(SMYJS.env.isShengbei, "7.33.0")) {
      SMYJSInterface.openNewWebview(url);
      return;
    }
    if (SMYJS.compareVersion(SMYJS.env.isShengbei, "7.31.0")) {
      location.href = url;
      return;
    }
    if (
      SMYJS.env.isShengbei &&
      (SMYJS.env.isIOS ||
        (SMYJS.env.isAndroid && SMYJS.compareVersion(SMYJS.env.isShengbei, "7.18.0")))
    ) {
      url =
        "smycredit://index?to=url&clicked=1" +
        (needLogin ? "&needlogin=1&url=" : "&url=") +
        encodeURIComponent(url);
    }
    location.href = url;
  },
  callAlipay(url) {
    if (SMYJS.env.isShengbei && SMYJS.env.isIOS) {
      url = `alipayqr://platformapi/startapp?saId=10000007&qrcode=${encodeURIComponent(url)}`;
      location.href = url;
    } else {
      this.openNewWebviewPage(url);
    }
  },
  getShengURL: function (qd) {
    let url = "";
    qd = qd || "";
    if (SMYJS.env.isIOS) {
      url = "https://www.smyfinancial.com/?lingdong=appstore";
    } else if (SMYJS.env.isWeixin || SMYJS.env.isQQInner) {
      url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.samoyed.credit";
    } else if (SMYJS.env.isAndroid) {
      var afterfix = "";
      if (qd) {
        afterfix = "_" + SMYJS.XSS(getParam("qd"));
      }
      url = "https://h5.smyfinancial.com/download/sheng" + afterfix + ".apk";
    } else if (SMYJS.env.isPC) {
      url = "https://www.smyfinancial.com/call_shengbei_app/index?download=1&qd=" + qd;
    } else {
      url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.samoyed.credit";
    }
    return url;
  },
};

function init() {
  window.SMYJS = SMYJS;
  window.smyWebViewDidFinishLoad = noop; //webview加载完成之后回调
  window.smyWebViewDidShow = function () {
    if (~location.pathname.indexOf("reviewService") || location.href.indexOf("infoGather") > -1) {
      // 额度重审,完件聚合服务回调
      location.replace(location.href.replace(location.search, ""));
    }
  }; //webview开始之前回调
  if (
    SMYJS.getParam("testSMYJSINTERFACE") ||
    (SMYJS.compareVersion(SMYJS.env.isShengbei, "6.0.0") && SMYJS.env.isIOS)
  ) {
    return resolveSMYJSINTERFACE();
  }
}

export type SMYJSType = typeof SMYJS;

init();

export { SMYJS };
