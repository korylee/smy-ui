//检测邮箱格式
export const isEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export function isBankCardNo(bankCardNo: string) {
  let s1 = 0,
    s2 = 0,
    reverse = bankCardNo.split("").reverse().join("");
  for (let i = 0; i < reverse.length; i++) {
    let digit = parseInt(reverse.charAt(i));

    if (digit < 0) {
      return false;
    }

    if (i % 2 == 0) {
      s1 += digit;
    } else {
      s2 += 2 * digit;
      if (digit >= 5) {
        s2 -= 9;
      }
    }
  }
  return (s1 + s2) % 10 == 0;
}

export const isChineseName = (name: string) =>
  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name);
