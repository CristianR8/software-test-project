import React, { useEffect, useState } from "react";
import Input from "./Input";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import validationLogin from "../validations/ValidationLogin";

export default function RegisterForm() {
  const { signup } = useAuth();

  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(e.target.value);
    e.preventDefault();
    setError("");
    try {
      await signup(user.email, user.password);
      navigate("/auth");
    } catch (error) {
      console.error("Error during sign up:", error);
      setError(error.message);
    }
  };

  const toggle = () => {
    setVisible(!visible);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen px-5 py-5">
      <div className="hidden sm:block">
        <img
          className="w-full h-full rounded-l-lg object-cover shadow-[0_3px_10px_rgb(0,0,0,0.5)]"
          src="/assets/agro.jpg"
          alt="Login"
        />
      </div>
      <div className="bg-fray-800 flex flex-col bg-stone-200 relative justify-center rounded-r-lg shadow-[0_3px_10px_rgb(0,0,0,0.5)]">
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px]-w-full mx-20 bg-amber-500 p-10 px-8 rounded-lg"
        >
          <h2 className="text-4xl text-gray-950 font-bold text-center">
            REGISTRATE
          </h2>
          <div className="flex flex-col text-gray-900 py-2">
            <label>Correo electrónico</label>
            <input
              type="email"
              nameRegister="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="tucorreo@gmail.com"
              className="w-full rounded-lg bg-gray-200 mt-2 p-2 focus:border-blue-500 focus:bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="flex flex-col text-gray-900 relative py-2">
            <label>Contraseña</label>
            <input
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="***********"
              nameRegister="password"
              className="w-full rounded-lg bg-gray-200 mt-2 p-2 focus:border-blue-500 focus:bg-gray-100 focus:outline-none"
              type={visible ? "text" : "password"}
            />
            <div className="text-2xl absolute my-11 right-2 text-gray-400">
              {visible === false ? (
                <AiOutlineEye onClick={toggle} />
              ) : (
                <AiOutlineEyeInvisible onClick={toggle} />
              )}
            </div>
          </div>

          <button className="w-full my-5 py-2 bg-stone-300 shadow-lg duration-200 shadow-teal hover:shadow-teal-50/70 text-gray-800 font-bold rounded-lg">
            REGISTRARSE
          </button>
        </form>
      </div>
    </div>
  );
}