import { useCallback, useState } from "react";
const defaultOptions = {
  raw: true,
};

export default function useLocalStorage(
  key,
  initialVal,
  options = defaultOptions
) {
  if (!key) throw new Error("useLocalStorage key may not be falsy");
  const deserializer = options
    ? options.raw
      ? String
      : options.deserializer
    : JSON.parse;

  const [state, setState] = useState(() => {
    try {
      const serializer = options
        ? options.raw
          ? String
          : options.serializer
        : JSON.stringify;

      const localStorageVal = localStorage.getItem(key);
      if (localStorageVal !== null) {
        return deserializer(localStorageVal);
      } else {
        initialVal && localStorage.setItem(key, serializer(initialVal));
        return initialVal;
      }
    } catch (err) {
      return initialVal;
    }
  });

  const set = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === "function" ? valOrFunc(state) : valOrFunc;
        if (typeof newState === undefined) return;
        let value = null;

        if (options.raw) {
          if (typeof newState === "string") value = newState;
          else value = JSON.stringify(newState);
        } else if (options.serializer) value = options.serializer(newState);
        else value = JSON.stringify(newState);

        localStorage.setItem(key, value);
        setState(deserializer(value));
      } catch (err) {}
    },
    [key, setState]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(undefined);
    } catch (err) {}
  }, [key, setState]);

  return [state, set, remove];
}
