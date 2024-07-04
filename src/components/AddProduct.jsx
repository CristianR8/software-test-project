import React, { useState } from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Input from "./Input";
import InputFile from "./InputFIle";
import InputFileTwo from "./InputFileTwo";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { doc, getDocs, setDoc, updateDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import useAddProductStore from "../store/addproductStore";
import { DocGenerator } from "../services/DocGenerator";

const uploadPdf = async (pdf, folder) => {
  const storageRef = ref(storage, `/database/${folder}/${pdf.name}`);
  await uploadBytes(storageRef, pdf).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { data } = useAddProductStore();

  const onSubmit = async (formData) => {
    setLoading(true);

    // Añadir el nuevo producto
    const newProductRef = doc(firestore, "productions", formData.codigo);
    await setDoc(newProductRef, {
      nombre: formData.nombre,
      codigo: formData.codigo,
      monto: formData.monto,
      ciudad: formData.ciudad,
      tipo: formData.tipo,
      mes: formData.mes,
      fechaCreacion: formData.fechaCreacion,
    });

    // Actualizar el saldo
    const saldosRef = collection(firestore, "saldos");
    const querySnapshot = await getDocs(saldosRef);
    if (!querySnapshot.empty) {
      const saldoDocRef = querySnapshot.docs[0].ref; // Tomar el primer documento de saldos
      const saldoActual = querySnapshot.docs[0].data().monto;
      const nuevoSaldo = parseFloat(saldoActual) - parseFloat(formData.monto);
      await updateDoc(saldoDocRef, { monto: nuevoSaldo });
      console.log("Saldo actualizado con éxito");
    } else {
      console.log("No se encontró ningún documento de saldo.");
      // Aquí podrías manejar la creación de un nuevo saldo si es necesario
    }

    setLoading(false);
    navigate("/documentation"); // Redirigir al usuario
  };

  const handleReturn = () => {
    navigate("/documentation");
  };

  return loading ? (
    <Spinner />
  ) : (
    <CardComponent>
      <div>
        <div className="bg-amber-400 shadow-md rounded-lg px-8 p-4 mx-52 text-center">
          <p className="text-3xl font-mono font-semibold ">
            {" "}
            Crear produccion{" "}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-1 gap-4 bg-green-950 bg-opacity-100 2xl:flex-row items-center justify-center rounded-lg shadow-lg py-2 px-8 mx-2 w-3/4 2xl:w-1/2 text-cente "
        >
          <div className="flex flex-row text-gray-400 w-full">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-4 mr-10 ">
                Nombre
              </label>
              <input
                nameRegister="nombre"
                type="text"
                placeholder="Nombre"
                {...register("nombre", { required: true })}
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-4 mr-10">
                Codigo
              </label>
              <input
                nameRegister="codigo"
                type="text"
                placeholder="Codigo"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                {...register("codigo", { required: true })}
              />
              {errors.codigo && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-grow text-gray-400">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
                Monto
              </label>
              <input
                nameRegister="monto"
                type="text"
                placeholder="Monto"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                {...register("monto", { required: true })}
              />
              {errors.monto && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
                Ciudad
              </label>
              <input
                nameRegister="ciudad"
                type="text"
                placeholder="Ciudad"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                defaultValue={data.ciudad}
                {...register("ciudad", { required: true })}
              />
              {errors.ciudad && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-grow text-gray-400">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
                Tipo
              </label>
              <input
                nameRegister="tipo"
                type="text"
                placeholder="Tipo"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                {...register("tipo", { required: true })}
              />
              {errors.tipo && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
                Mes
              </label>
              <input
                nameRegister="mes"
                type="text"
                placeholder="Digita el mes aqui"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                {...register("mes", { required: true })}
              />
              {errors.mes && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-grow text-gray-400">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">
                Fecha de creacion
              </label>
              <input
                type="date"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                {...register("fechaCreacion", { required: true })}
              />
              {errors.fechaCreacion && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row text-gray-400 w-full">
            <InputFileTwo Submitted={`${Object ? "green" : "gray"}`} />
          </div>

          <div className="flex w-full text-gray-400 py-2">
            <button className="w-full text-xl my-5 py-2 bg-gray-200 hover:shadow-lg hover:shadow-gray-500/40 duration-150 text-gray-800 font-bold rounded-lg">
              Agregar
            </button>
          </div>
        </form>
      </div>

      <Return onClick={handleReturn} />
    </CardComponent>
  );
};

export default AddProduct;
