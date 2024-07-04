import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import CustomSelectField from "./CustomSelectField";
import { set, useForm } from "react-hook-form";

import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../firebase";

import { DocGenerator } from "../services/DocGenerator";
import PizZip from "pizzip";
import ImageModule from "docxtemplater-image-module-free";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

import useAddProductStore from "../store/addproductStore";
import { modelHV } from "../models/modelHV";

import { useLocation } from "react-router-dom";

import Input from "./Input";
import { ref, deleteObject } from "firebase/storage";

const EditHV = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { hv, setHv } = useAddProductStore();

  const { state } = useLocation();

  let title = state?.title;
  let name = state?.name;
  let name2 = state?.name2;
  let folder = state?.folder;
  let code = state?.code;

  const [dataEdit, setDataEdit] = useState({});

  const retrieveDataEdit = async () => {
    if (name !== undefined) {
      let id = name.split(".")[0];
      console.log(id);
      //retrieve from firestore
      const docRef = doc(firestore, "hv", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDataEdit(docSnap.data());
        reset(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    retrieveDataEdit();
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  function getBase64(file, onLoadCallback) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const onSubmit = async (data) => {
    setLoading(true);

    let dataObj = modelHV(
      data,
      selectedOptions,
      camposAdicionales,
      camposAdicionalesAccesorios
    );

    //remove undefined fields
    Object.keys(dataObj).forEach(
      (key) => dataObj[key] === undefined && delete dataObj[key]
    );

    dataObj["firma"] = await getBase64(data.firma[0]);
    dataObj["imagenesEquipo"] = await getBase64(data.imagenesEquipo[0]);

    await setDoc(
      doc(firestore, "facturas", String(dataObj.inventario)),
      dataObj
    );

    if (code !== undefined) {
      // delete the last file
      if (name !== undefined) {
        let storageRef = ref(storage, `database/facturas/${name}`);
        await deleteObject(storageRef);
      }

      let images = {
        imagenesEquipo: dataObj.imagenesEquipo,
        firma: dataObj.firma,
      };
      await DocGenerator(
        "formularioEditHV",
        { ...dataObj, ...images },
        String(dataObj.inventario) + ".docx",
        "facturas"
      );
      await updateDoc(doc(firestore, "facturas", String(code)), {
        facturas: String(dataObj.inventario) + ".docx",
      });
      navigate("/documentation/hoja-de-vida", {
        state: {
          title: title,
          name: String(dataObj.inventario) + ".docx",
          folder: folder,
          code: String(code),
          name2: name2,
        },
      });
    } else {
      setHv(dataObj);
      navigate("/add-product");
    }

    console.log(dataObj);
    setLoading(false);
  };

  const handleReturn = async () => {
    navigate("/add-product");
  };

  return loading ? (
    <Spinner />
  ) : (
    <CardComponent>
      <div className="bg-amber-400 shadow-md rounded-lg px-8 p-4 mx-52 text-center">
        <p className="text-3xl font-mono font-semibold">
          Edicion - Hoja de vida
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

      <div className="flex justify-center mt-4 text-center">
        <form
          className="bg-green-950 bg-opacity-100 rounded-lg shadow-lg p-8 mx-2 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="fechaActual"
                className="block text-sm font-medium text-gray-200"
              >
                Fecha Actual
              </label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                {...register("fechaActual", { required: true })}
              />
              {errors.fechaActual && (
                <span className="text-xs text-red-500">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="fechaActual"
                className="block text-sm font-medium text-gray-200"
              >
                Fecha Corte
              </label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                {...register("fechaActual", { required: true })}
              />
              {errors.fechaActual && (
                <span className="text-xs text-red-500">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="costo"
                className="block text-sm font-medium text-gray-200"
              >
                Costo
              </label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                {...register("costo", { required: true })}
              />
              {errors.costo && (
                <span className="text-xs text-red-500">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="direccionComprador"
                className="block text-sm font-medium text-gray-200"
              >
                Dirección del Comprador
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                {...register("direccionComprador", { required: true })}
              />
              {errors.direccionComprador && (
                <span className="text-xs text-red-500">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex relative w-full text-gray-200 py-2">
            <button className="w-full my-5 py-2 text-2xl bg-gray-300 hover:shadow-gray-500/50 duration-150 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg">
              Agregar
            </button>
          </div>
        </form>
      </div>
      <Return onClick={() => navigate(-1)} />
    </CardComponent>
  );
};

export default EditHV;
