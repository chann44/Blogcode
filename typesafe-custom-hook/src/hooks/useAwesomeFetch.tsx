import { useEffect, useReducer } from "react";

function reducer(state: any, action: any) {
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
const FetchData = async (
  cancelRequest: Boolean,
  url: string,
  dispatch: any
) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (cancelRequest) return;
    dispatch({ type: "FETCHED", payload: data });
  } catch (error) {
    if (cancelRequest) return;
    dispatch({
      type: "FETCH_ERROR",
      payload: (error as Error).message,
    });
  }
};

const initialState = {
  status: "idl",
  data: [],
  error: null,
};

export function useAwesomeFetch(url: string) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;
    dispatch({ type: "FETCHING" });
    FetchData(cancelRequest, url, dispatch);

    return () => {
      cancelRequest = true;
    };
  }, [url]);

  return state;
}
