import { useEffect, useState } from 'react';
import api from '../services/api';

// GET /api/<path>. Expects { success, data }. Uses `fallback` if the request fails or returns no data.
export default function useApi(path, fallback) {
  const [state, setState] = useState({ data: null, loading: true });
  useEffect(() => {
    let alive = true;
    api.get(path)
      .then(({ data }) => alive && setState({ data: data.data ?? fallback, loading: false }))
      .catch(() => alive && setState({ data: fallback, loading: false }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  const empty = Array.isArray(state.data) && state.data.length === 0 && Array.isArray(fallback) && fallback.length > 0;
  return { data: empty ? fallback : state.data, loading: state.loading };
}
