import React, { useEffect, useState } from "react";
import { FcSpeaker } from "react-icons/fc";

const Dict = () => {
  const [data, setData] = useState(null);
  const [searchWord, setSearchWord] = useState("");

  const handleClick = () => {
    if (searchWord.trim()) {
      setSearchWord(searchWord.trim());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchWord) return;
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
        );
        const responseJson = await response.json();
        setData(responseJson[0]);
      } catch (error) {
        console.log("Error in fetching data: " + error);
      }
    };
    fetchData();
  }, [searchWord]);

  const playAudio = () => {
    if (data && data.phonetics && data.phonetics[0].audio) {
      let audio = new Audio(data.phonetics[0].audio);
      audio.play();
    } else {
      console.log("Audio not available for this word.");
    }
  };

  return (
    <div className="bg-gray-200 h-screen w-screen flex flex-col items-center p-6">
      <h1 className="text-3xl text-gray-700 mb-6">Free Dictionary</h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter word..."
          className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <button
          className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-500 transition"
          onClick={handleClick}
        >
          Search
        </button>
      </div>

      {data && (
        <div className="flex flex-col max-w-lg bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl mb-2 text-gray-800">{data.word}</h1>
          <button onClick={playAudio}>
            <FcSpeaker size="26px" />
          </button>
          {data.meanings.map((meaning, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg text-gray-600 mb-1">Part of speech</h3>
              <p className="text-gray-700 mb-4">{meaning.partOfSpeech}</p>
              <h3 className="text-lg text-gray-600 mb-1">Definition</h3>
              <p className="text-gray-700 mb-4">
                {meaning.definitions[0].definition}
              </p>
              {meaning.definitions[0].example && (
                <>
                  <h3 className="text-lg text-gray-600 mb-1">Example</h3>
                  <p className="text-gray-700">
                    {meaning.definitions[0].example}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dict;
