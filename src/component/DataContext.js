import React, { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [listData, setListData] = useState([]);
  // const [faceData, setFaceData] = useState([]);

  useEffect(() => {
    const fetchListData = async () => {
      // In a real application, you would fetch this data from an API
      const listSampleData = [
      { id: "#2233", person: "Ki-jae", date: "24-08-22", shape: "img" },
      { id: "#3826", person: "Unknown", date: "24-08-26", shape: "vid" },
      { id: "#1103", person: "Dust_kim", date: "24-09-01", shape: "img" },
      { id: "#4362", person: "Jang-dragon", date: "24-09-06", shape: "img" },
      { id: "#5555", person: "Test1", date: "24-09-10", shape: "vid" },
      { id: "#6666", person: "Test2", date: "24-09-15", shape: "vid" },
      { id: "#7777", person: "Test3", date: "24-09-20", shape: "img" },
      ];
      const sortedListData = listSampleData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setListData();
    };

    // const fetchFaceData = async () => {
    //   // In a real application, you would fetch this data from an API
    //   const faceSampleData = [
    //     { id: "#2233", person: "Ki-jae", date: "24-08-22", part: "Sleeping" },
    //     { id: "#3826", person: "Unknown", date: "24-08-26", part: "Thief" },
    //     { id: "#1103", person: "Dust_kim", date: "24-09-01", part: "Drunk" },
    //     { id: "#4362", person: "Jang-dragon", date: "24-09-06", part: "Phone" },
    //     { id: "#5555", person: "Test1", date: "24-09-10", part: "Walking" },
    //     { id: "#6666", person: "Test2", date: "24-09-15", part: "Running" },
    //     { id: "#7777", person: "Test3", date: "24-09-20", part: "Eating" },
    //   ];
    //   const sortedFaceData = faceSampleData.sort(
    //     (a, b) => new Date(b.date) - new Date(a.date)
    //   );
    //   setFaceData(sortedFaceData);
    // };

    // fetchListData();
    // fetchFaceData();
  }, []);

  return (
    <DataContext.Provider value={{ listData }}>
      {children}
    </DataContext.Provider>
  );
};
