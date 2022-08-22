const host = location.host;
export const APIHost = ~[
  "static.smyfinancial.com",
  "staticxj.smyfinancial.com",
  "m.smyfinancial.com",
].indexOf(host)
  ? "https://wwwhb.smyfinancial.com"
  : "//" + host;

export const _SERVER_DATA_ = window.SERVER_DATA || (window.serverData = {});
