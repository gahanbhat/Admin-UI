import { useState, useEffect } from "react";

const calculateRange = (data) => {
  const range = [];
  const num = Math.ceil(data.length / 10);
  let i = 1;
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return range;
};

const sliceData = (data, page, inputData) => {
  if (inputData === "" || inputData === null || inputData === undefined) {
    return data.slice((page - 1) * 10, page * 10);
  }
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(inputData) ||
      item.email.toLowerCase().includes(inputData) ||
      item.role.toLowerCase().includes(inputData)
  );
  return filteredData.slice((page - 1) * 10, page * 10);
};

const useTable = (data, page, inputData) => {
  const [tableRange, setTableRange] = useState([]);
  const [slice, setSlice] = useState([]);

  useEffect(() => {
    const range = calculateRange(data, 10);
    setTableRange([...range]);

    const slice = sliceData(data, page, inputData);
    setSlice([...slice]);
  }, [data, setTableRange, page, setSlice, inputData]);

  return { slice, range: tableRange };
};

export default useTable;
