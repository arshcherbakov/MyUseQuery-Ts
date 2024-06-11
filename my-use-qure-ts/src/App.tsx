import { useEffect, useState, useRef, FC } from "react";
import "./App.css";

const useUpdateEffect = (
  argsParams: any[],
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

interface IUseQuery {
  isPending: boolean;
  data: any[];
  error: string;
  isLoading: boolean;
  isError: boolean;
}

const useQuery = (
  argsParams: any[],
  queryFn: () => Promise<Response>
): IUseQuery => {
  const [data, setData] = useState<any[]>([]);
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

  const { isPending, data, error, isLoading, isError } = useQuery([isPop], () =>
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
  );

  console.log(isLoading);
  return (
    <div className="App">
      {isPending ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <p>{error}</p>
      ) : (
        data.map((pokemon: any, index: number) => (
          <p key={index}>{pokemon.name}</p>
        ))
      )}
      <button onClick={() => setIsPop(true)}>Проверить загрузку</button>
    </div>
  );
};

export default App;
