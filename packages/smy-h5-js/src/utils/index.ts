import { APIHost, _SERVER_DATA_ } from '../constant'
export { isEmail, isBankCardNo, isChineseName } from './is'

export const noop = () => {}

//获取App在头部设置的用户session信息
export function getHeaderSessions(data: string, key: string) {
  if (data) {
    const data_array = data.split(';')
    let user_data: any = {}
    data_array.forEach((item) => {
      user_data[item.split('=')[0].replace(/(^\s*)/g, '')] = item.split('=')[1]
    })
    return user_data[key] || ''
  }
  return ''
}

export function backRefresh(initFn: any) {
  function getHiddenProp() {
    let prefixes = ['webkit', 'moz', 'ms', 'o']
    // 如果hidden 属性是原生支持的，我们就直接返回
    if ('hidden' in document) {
      return 'hidden'
    }

    // 其他的情况就循环现有的浏览器前缀，拼接我们所需要的属性
    for (let i = 0; i < prefixes.length; i++) {
      // 如果当前的拼接的前缀在 document对象中存在 返回即可
      if (prefixes[i] + 'Hidden' in document) {
        return prefixes[i] + 'Hidden'
      }
    }

    // 其他的情况 直接返回null
    return null
  }
  function getVisibilityState() {
    let prefixes = ['webkit', 'moz', 'ms', 'o']

    if ('visibilityState' in document) {
      return 'visibilityState'
    }

    for (let i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + 'VisibilityState' in document) {
        return prefixes[i] + 'VisibilityState'
      }
    }
    // 找不到返回 null
    return null
  }

  function eventFunc() {
    const visibilityState = getVisibilityState()
    if (!visibilityState) return
    if ((document as any)[visibilityState] == 'hidden') {
      //当前页面跳转出去的情况
    } else {
      initFn()
    }
  }
  let visProp = getHiddenProp()
  if (visProp) {
    // 有些浏览器也需要对这个事件加前缀以便识别。
    let evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange'
    document.addEventListener(evtname, eventFunc, false)
  }
  return function () {
    if (visProp) {
      let evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange'
      document.removeEventListener(evtname, eventFunc, false)
    }
  }
}

export const getParam = (name: string, url?: string) => {
  url = url || window.location.href
  var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)'),
    m = url.match(r)
  return !m ? '' : m[2]
}

// url字符串替换处理（param:参数，newVal:替换的内容，为空则为删除该参。目前只支持单参不支持多参）
export function replaceParamVal(url: string, param: string, newVal?: string) {
  var url = url || window.location.href
  if (!param) {
    return url
  }
  var re: any
  if (newVal) {
    re = eval('/(' + param + '=)([^&]*)/gi')
    // 没有这个参
    if (url === url.replace(re, param + '=' + newVal)) {
      return url + (url.indexOf('?') >= 0 ? '&' : '?') + param + '=' + newVal
    } else {
      return url.replace(re, param + '=' + newVal)
    }
  } else {
    re = eval('/(\\?|&)(' + param + '=)([^&]*)(&)?/gi')
    return url.replace(re, (p0, p1, p2, p3, p4) => {
      if (p1 === '?') {
        return p4 ? '?' : ''
      } else if (p1 === '&') {
        return p4 ? '&' : ''
      }
      return ''
    })
  }
}

const smyInterfaceKeys = [
  'appToCreditExam',
  'skipZMXY',
  'finishZMXY',
  'appGoBack',
  'appToHome',
  'appToWeixin',
  'appLogin',
  'appMGMLogin',
  'appToWelfareTargetPage',
  'appToBorrow',
  'userDidGetWelfare',
  'setBackBtnModeDefault',
  'setBackBtnModeClose',
  'setBackBtnRunJS',
  'appToFinance',
  'loan_zhongyuan',
  'appToSetNewTradePassword',
  'appRedirect',
  'appRefreshFinance',
  'checkQQAuth',
  'checkQQAppAuth',
  'updateCreditLimitInfo',
  'setWebviewBtn',
  'appToMerchantAuth',
  'appToMerchantLoan',
  'appShare',
  'appToCreditCardRepayWithCouponId',
  'updateCreditCardUserInfo',
  'takePhotoFromCamera',
  'update5Y',
  'appResetPassword',
  'loanNextBtn',
  'refreshMerchantStatus',
  'appToRepaymentConfirm',
  'appToCompleteInfo',
  'setWebviewTextBtn',
  'appToCreditCardRepay',
  'setCustomNavigationBar',
  'signReminderStatusChanged',
  'requestTradePassword',
  'tryToRemindOpenSystemPush',
  'supplementIDCardForAPIDiversion',
  'apiDiversionSupplementIDCardForLoan',
  'apiDiversionSupplementForLoan',
  'appToWeChatPayment',
  'supplementLivenessForAPIDiversion',
  'getSmyUserSession',
  'savePhotos',
  'appToInAppPurchase',
  'queryPurchaseStatus',
  'takePhotoFromPhotoLibrary',
  'paymentForVipSucceeded',
  'supplementForLoanSubmit',
  'loanPagePermissionInfoInit',
  'openNewWebview',
  'goXiaoManAdvert',
  'chooseContact',
  'showLoanProtocolsAlert',
  'borrowDidComplete',
  'chooseContactNew',
  'uploadContactList',
  'AndroidHasContactPerm',
  'queryContactsAuthorisationStatus',
  'verifyLiveness',
  'appLogout',
  'queryAppInstallStatus',
  'launchAppStoreDetail',
  'addStringToPasteBoard',
  'getBiometricstStatus',
  'tryToBiometricsGuide',
  'tryToUseBiometrics',
  'delBiometricsToken',
  'appToGrant',
  'isSlideToBottom',
  'callAlipayDeductSign',
  'webviewGoBack',
  'loanGuideApplyInsurance', // 投保资金方引导
  'hasUnbindBankCard',
  'changeRecordScreenStatus',
  'shopOrderStatusChanged',
  'jumpToEshopTab',
  'activeProdAccountFromH5',
] as const

export type SmyInterfaceKey = typeof smyInterfaceKeys[number]

export type SmyInterfaceValue = (param?: string) => void

//SMYJSInterface接口说明在线文档：https://doc.weixin.qq.com/sheet/e3_m_NCFpYfHOLuhc?scode=ADsAHgeCAAs0qewOcwALkAkwYFAFI&tab=BB08J2
//smyjsinterface resolve
export function resolveSMYJSINTERFACE() {
  const smyMessageHandler = window.webkit?.messageHandlers.SMYJSInterface
  if (!smyMessageHandler) return
  const SMYJSInterface = window.SMYJSInterface || (window.SMYJSInterface = {} as any)

  smyInterfaceKeys.forEach((method) => {
    if (SMYJSInterface[method]) return
    const func: SmyInterfaceValue = function () {
      smyMessageHandler.postMessage({
        method,
        param: arguments[0] ? arguments[0].toString() : '',
      })
    }
    SMYJSInterface[method] = func
  })
  return SMYJSInterface
}

const session_id = _SERVER_DATA_.TDtokenId || uuid() + '-' + Date.now()

export function smyStat(baiduData: any, bigData: any, tmp: any, uid?: string) {
  setTimeout(() => {
    if (baiduData && typeof baiduData == 'string') {
      window._hmt && window._hmt.push(['_trackEvent', 'web', 'event', baiduData])
    } else if (typeof baiduData == 'object' && baiduData.length) {
      window._hmt && window._hmt.push(['_trackEvent', baiduData[0], baiduData[1], baiduData[2]])
    }

    if (bigData || tmp) {
      // tmp参数仅为兼容过去的格式.
      var upload = bigData || tmp || {}
      // 拦截页面对比自动监控预警 不做事件上报
      if (getParam('bigDataStatus') === 'continue') {
        //主动回调防止页面逻辑卡住
        if (upload.callback && typeof upload.callback === 'function') {
          upload.callback()
        }
        return false
      }
      if (getParam('uid')) {
        upload.session = {
          uid: getParam('uid'),
        }
      } else {
        upload.session = {
          uid: uid || SMYJS.getHeaderSessions(document.cookie, 'smy_app_uid'),
        }
      }
      if (getParam('device_unique_id')) {
        upload.device_unique_id = getParam('device_unique_id')
      }
      if (getParam('custOrg')) {
        upload.custOrg = getParam('custOrg')
      }
      upload.smartId = session_id
      var img = document.createElement('img')
      var callback = upload.callback || false
      img.onerror = function () {
        callback && callback()
      }
      img.onload = img.onerror
      delete upload.callback

      const qdcyhd =
        (getParam('qd') ? '&qd=' + getParam('qd') : '') +
        (getParam('cy') ? '&cy=' + getParam('cy') : '') +
        (getParam('hd') ? '&hd=' + getParam('hd') : '')
      const lowPlatform = navigator.platform.toLowerCase()
      ;(lowPlatform.indexOf('win') != -1 || lowPlatform.indexOf('mac') != -1) && console.log(upload) //for developer, do not delete.

      const bd_raw = JSON.stringify(upload)
      const bd_string = encodeURIComponent(bd_raw)
      img.src =
        APIHost + '/publicAPI/bigData?r=' + Math.random() + qdcyhd + '&bigData=' + bd_string + '&l=' + bd_raw.length
    }
  }, 0)
}

export function uuid() {
  const s: any[] = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

export function compareVersion(curV: string, reqV: string) {
  if (curV && reqV) {
    var arr1 = curV.split('.'),
      arr2 = reqV.split('.')
    var minLength = Math.min(arr1.length, arr2.length),
      position = 0,
      diff = 0
    while (position < minLength && (diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0) {
      position++
    }
    diff = diff != 0 ? diff : arr1.length - arr2.length
    return diff >= 0
  } else {
    return false
  }
}

export function parseURL(url: string) {
  //解析URL
  url = url || location.href
  let a = document.createElement('a')
  a.href = url
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      let ret: Record<string, string> = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  }
}
