import React from "react";
import { Link } from "react-router-dom";

const NameCard = ({ key, title, codigo, onClick, onDelete }) => {
  return (
    <div className="flex justify-between items-center bg-green-800 text-white hover:bg-green-600 hover:scale-110 transition duration-200 rounded-lg mx-14 my-2 p-4">
      <div
        onClick={() => onClick({ codigo })}
        className="flex-grow text-center text-4xl"
      >
        <Link
          to={key}
          title={title}
          className="flex flex-rows items-center justify-center space-y-2"
        >
          <div className="text-lg 2xl:text-2x text-left">{title}</div>
        </Link>
      </div>
      <div>
        <button
          className="border-4 bg-rose-600 text-white text-lg px-8 py-2 rounded-xl font-bold hover:scale-110 hover:bg-rose-700 transition duration-200	"
          onClick={() => onDelete(codigo)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NameCard;
