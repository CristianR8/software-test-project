import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function InputFileTwo({
  nameLabel,
  nameRegister,
  register,
  routeTo,
  onClick,
  Submitted,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mr-3 flex-grow" onClick={onClick}>
      <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
        {nameLabel}
      </label>
      <div className="flex">
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          {...register}
        />
      </div>
    </div>
  );
}
