import { useCallback, useEffect, useState } from 'react';
import { ambilData } from './api.js';

export default function useData(path) {
  const [state, setState] = useState({ loading: true, rows: [], sumber: null, catatan: null, error: null });

  const muat = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const r = await ambilData(path);
      setState({ loading: false, rows: r.rows, sumber: r.sumber, catatan: r.catatan, error: null });
    } catch (e) {
      setState({ loading: false, rows: [], sumber: null, catatan: null, error: e.message });
    }
  }, [path]);

  useEffect(() => { muat(); }, [muat]);

  return { ...state, muat };
}
