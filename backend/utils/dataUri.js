import DatauriParser from "datauri/parser.js";
import path from "path";


const getDataUri = (file) => {
  const base64 = file.buffer.toString("base64");

  return {
    content: `data:${file.mimetype};base64,${base64}`,
  };
};

export default getDataUri;