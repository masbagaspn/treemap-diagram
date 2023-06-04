import { useEffect, useState } from "react";
import dataJSON from "../data.json";
import NavBar from "./components/NavBar";
import Chart from "./components/Chart";

function App() {
  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState("video-games");

  useEffect(() => {
    const getDataset = async (section) => {
      setIsLoading(true);

      const selected = dataJSON.find((d) => d.id === section);
      const response = await fetch(selected.url);
      const data = await response.json();

      setDataset({ ...selected, data });
      setIsLoading(false);
    };

    getDataset(section);
  }, [section]);

  return (
    <main className="w-screen max-w-screen h-screen max-h-screen p-8 font-jakarta flex flex-col justify-between items-center">
      <NavBar data={dataJSON} state={{ section, setSection }} />
      {isLoading === true ? null : <Chart data={dataset} />}
    </main>
  );
}

export default App;
