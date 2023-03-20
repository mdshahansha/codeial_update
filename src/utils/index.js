export * from './constants';
export const setItemInLocalStorage = (key, value) => {
  if (!key || !value) {
    return console.error('Cannot store at local storage');
  }
  const valueToStore =
    typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};
export const getItemFromLocalStorage = (key) => {
  if (!key) {
    return console.log('Cannot get value from the local storage');
  }
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) {
    return console.log('Cannot get value from the local storage');
  }
  return localStorage.removeItem(key);
};

export const getFormBody = (params) => {
  let formBody = [];
  for (let property in params) {
    let encodeKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodeKey + '=' + encodedValue);
  }
  return formBody.join('&');
};
