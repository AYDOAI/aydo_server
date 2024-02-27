
export function checkTimeoutEx(item, ident, method, timeout = 1000, force = false) {
  if (force || !item[ident] || new Date().getTime() - item[ident] >= timeout) {
    clearTimeout(item[`${ident}_timeout`]);
    item[ident] = new Date().getTime();
    method();
  } else {
    clearTimeout(item[`${ident}_timeout`]);
    item[`${ident}_timeout`] = setTimeout(() => {
      item[ident] = new Date().getTime();
      method();
    }, timeout - (new Date().getTime() - item[ident]));
  }
}