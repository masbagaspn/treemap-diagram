import { useEffect, useState } from "react";
import dataJSON from "../data.json";
import NavBar from "./components/NavBar";

function App() {
  const [data, setData] = useState();
  const [section, setSection] = useState("video-games");

  const getDataset = async (section) => {
    const selected = dataJSON.find((d) => d.id === section);
    const response = await fetch(selected.url);
    const data = await response.json();

    setData({ ...selected, data });
  };

  useEffect(() => {
    getDataset(section);
  }, [section]);

  return (
    <main className="w-screen max-w-screen h-screen max-h-screen p-8 font-jakarta flex flex-col justify-between items-center">
      <NavBar data={dataJSON} state={{ section, setSection }} />
    </main>
  );
}

export default App;
