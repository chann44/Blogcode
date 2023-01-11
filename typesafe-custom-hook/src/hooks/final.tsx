import { useEffect, useRef, useReducer } from "react";
import { Type } from "typescript";

export enum FetchState {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  FETCH_ERROR = "FETCH_ERROR",
}

type Action = {
  type: FetchState;
  payload?: any;
};

type RequestState<Type> = {
  status: string;
  error: null | Error;
  data?: Type;
};

function reducer<Type>(
  state: RequestState<Type>,
  action: Action
): RequestState<Type> {
  switch (action.type) {
    case "FETCHING":
      return { ...state, status: "fetching" };
    case "FETCHED":
      return { ...state, status: "fetched", data: action.payload };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.payload };
    default:
      return state;
  }
}

export function useFetch<Type>(url: string): RequestState<Type> {
  const cache = useRef<any>({});
  const initialState: RequestState<Type> = {
    status: "idle",
    error: null,
    data: [] as Type,
  };

  const [state, dispatch] = useReducer<
    React.Reducer<RequestState<Type>, Action>
  >(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;
    const fetchData = async () => {
      dispatch({ type: FetchState.FETCHING });
      if (cache.current[url]) {
        const data = cache.current[url];
        dispatch({ type: FetchState.FETCHED, payload: data });
      } else {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cache.current[url] = data;
          if (cancelRequest) return;
          dispatch({ type: FetchState.FETCHED, payload: data });
        } catch (error) {
          if (cancelRequest) return;
          dispatch({
            type: FetchState.FETCH_ERROR,
            payload: (error as Error).message,
          });
        }
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url]);

  return state;
}
