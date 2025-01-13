import useSWR from 'swr';

type User = {
  firstName: string;
  lastName: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (res.ok) {
    return res.json();
  }
  if (res.status === 401) {
    return null;
  }
  throw new Error('Erreur inattendue');
};

export function useUserSession() {
  const { data, error, mutate } = useSWR<User | null>('/api/user', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    user: data || null,
    isLoading: data === undefined && !error,
    error,
    refreshUser: () => mutate(null, { revalidate: true }),
  };
}
