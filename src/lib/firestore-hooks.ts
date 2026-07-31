"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  query,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type WithId<T> = T & { id: string };

/**
 * `deps` must list every value that the `constraints` closures capture
 * (e.g. the filter values passed to `where(...)`), the same way a normal
 * `useEffect` dependency array would — constraint objects themselves don't
 * compare equal across renders, so they can't be used to detect changes.
 */
export function useCollectionData<T = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  deps: unknown[] = [],
) {
  const [data, setData] = useState<WithId<T>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionPath), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, ...deps]);

  return { data, loading };
}

export function useDocData<T = DocumentData>(path: string) {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, path),
      (snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [path]);

  return { data, loading };
}

export type Configuracao = {
  nomeIgreja: string;
  cnpj: string | null;
  logoUrl: string | null;
  enderecoSede: string | null;
  telefoneSede: string | null;
  nomePresidente: string | null;
  cargoPresidente: string | null;
  nomeSecretario: string | null;
  cargoSecretario: string | null;
};

const CONFIGURACAO_PADRAO: Configuracao = {
  nomeIgreja: "Minha Igreja",
  cnpj: null,
  logoUrl: null,
  enderecoSede: null,
  telefoneSede: null,
  nomePresidente: null,
  cargoPresidente: "Pastor Presidente",
  nomeSecretario: null,
  cargoSecretario: "1º Secretário",
};

export function useConfiguracao() {
  const { data, loading } = useDocData<Configuracao>("configuracao/geral");
  return { configuracao: data ?? CONFIGURACAO_PADRAO, loading };
}
