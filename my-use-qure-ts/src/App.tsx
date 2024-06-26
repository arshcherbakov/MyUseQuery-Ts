import { useEffect, useState, useRef, FC } from "react";
import "./App.css";

const useUpdateEffect = (
  argsParams: unknown[] = [],
  fnSecondRendering: (isFirstRender: boolean) => void
) => {
  const renderFirst = useRef(true);

  useEffect(() => {
    if (renderFirst.current) {
      renderFirst.current = false;
    } else {
      fnSecondRendering(false);
    }
  }, argsParams);
};

interface IPokemon {
  name: "string";
  url: "string";
}

interface IUseQuery<T> {
  isPending: boolean;
  data?: T;
  error: string;
  isLoading: boolean;
  isError: boolean;
}

const useQuery = <T,>(
  argsParams: unknown[] = [],
  queryFn: () => Promise<Response>
): IUseQuery<T> => {
  const [data, setData] = useState<T | undefined>(null as T);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useUpdateEffect(argsParams, setIsLoading);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await queryFn();
        const data = await response.json();

        setData(data.results);
      } catch (error: unknown) {
        setIsError(true);
        setError((error as Error).message);
      } finally {
        setIsPending(false);
      }
    };

    getData();
  }, argsParams);

  return {
    isPending,
    data,
    error,
    isLoading,
    isError,
  };
};

const App: FC = () => {
  const [isPop, setIsPop] = useState<boolean>(false);

  const { isPending, data, error, isLoading, isError } = useQuery<IPokemon[]>(
    [isPop],
    () => fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
  );

  console.log(isLoading);

  return (
    <div className="App">
      {isPending ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <p>{error}</p>
      ) : (
        data?.map((pokemon: IPokemon, index: number) => (
          <p key={index}>{pokemon.name}</p>
        ))
      )}
      <button onClick={() => setIsPop(true)}>Проверить загрузку</button>
    </div>
  );
};

export default App;
