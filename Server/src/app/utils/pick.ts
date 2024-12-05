const pick = <T, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.keys(obj).includes(key as string)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
