import { useEffect, useReducer } from "react";

export function useAwesomeFetch(url: string) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const FetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (cancelRequest) return;
      dispatch({ type: FetchState.FETCHED, payload: data });
    } catch (error) {
      if (cancelRequest) return;
      dispatch({
        type: FetchState.FETCH_ERROR,
        payload: (error as Error).message,
      });
    }
  };
}
