import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import { AiOutlineWarning, AiOutlineCheck } from "react-icons/ai";
import { firestore, storage } from "../firebase";
import { Tooltip } from "react-tooltip";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc, // Asegúrate de incluir esta línea
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Return from "./Return";
import { useAuth } from "../context/authContext";

const Maintenance = () => {
  const [productions, setProductions] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/module");
  };

  const retrieveData = async () => {
    const querySnapshot = await getDocs(collection(firestore, "productions"));
    const productionsData = querySnapshot.docs.map((doc) => ({
      codigo: doc.codigo,
      ...doc.data(),
    }));
    setProductions(productionsData);
  };

  // Esta función se llamará cuando se envíe el formulario
  const onSubmitFunction = async (data) => {
    const { codigo, mes } = data; // Desestructura los valores ingresados en el formulario
    console.log(firestore);
    console.log(codigo);
    // Verifica primero si el código ingresado corresponde a una producción existente
    const docRef = doc(firestore, "productions", codigo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Si el documento existe, actualiza el mes
      try {
        await updateDoc(docRef, { mes: mes });
        Swal.fire("Éxito", "Mes de producción actualizado", "success");
        retrieveData(); // Esto actualiza la lista de producciones para reflejar los cambios
      } catch (error) {
        console.error("Error al actualizar el mes de la producción:", error);
        Swal.fire(
          "Error",
          "No se pudo actualizar el mes de la producción",
          "error"
        );
      }
    } else {
      // Si el documento no existe, muestra una alerta
      Swal.fire(
        "Error",
        "No se encontró una producción con ese código",
        "error"
      );
    }
  };

  const calculateSemaforizacion = (mes) => {
    const months = {
      Enero: 1,
      Febrero: 2,
      Marzo: 3,
      Abril: 4,
      Mayo: 5,
      Junio: 6,
      Julio: 7,
      Agosto: 8,
      Septiembre: 9,
      Octubre: 10,
      Noviembre: 11,
      Diciembre: 12,
    };

    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    if (currentMonth < months[mes]) {
      return "rojo";
    } else if (currentMonth > months[mes]) {
      return "verde";
    } else {
      return "amarillo";
    }
  };
  const removeMaintenance = async (codigo) => {
    const result = await Swal.fire({
      title: "¿Estas seguro?",
      text: "¡Esta acción removerá la producción de la tabla!",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    });

    if (result.isConfirmed) {
      try {
        // Referencia al documento en Firestore
        const docRef = doc(firestore, "productions", String(codigo));

        // Eliminar el documento
        await deleteDoc(docRef);

        // Mostrar confirmación al usuario
        Swal.fire(
          "Eliminado",
          "La producción ha sido eliminada con éxito",
          "success"
        );

        // Actualizar el estado para reflejar la eliminación en la interfaz de usuario
        setProductions((prevProductions) =>
          prevProductions.filter((production) => production.codigo !== codigo)
        );
      } catch (error) {
        // Manejar errores, por ejemplo, mostrar un mensaje al usuario
        Swal.fire("Error", "No se pudo eliminar la producción", "error");
        console.error("Error al eliminar producción:", error);
      }
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <CardComponent>
      <div className="bg-amber-400 shadow-md text-white rounded-lg p-4 text-center">
        <p className="text-3xl 2xl:text-4xl font-mono text-gray-950 font-semibold ">
          BIENVENIDO AL CRONOGRAMA DE PRODUCCIONES
        </p>
      </div>

      <div className="max-w-[400px]-w-full p-8 m-8 bg-gray-50 rounded-lg">
        <label className="block bg-green-800 text-white shadow-md rounded-full p-3 mb-5 text-center text-lg font-mono font-semibold">
          Cronograma de producciones
        </label>
        <label className="flex items-center justify-center text-gray-800 font-semibold my-8 text-lg ">
          Mes:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-4"
          >
            <option>Todos</option>
            <option>Enero</option>
            <option>Febrero</option>
            <option>Marzo</option>
            <option>Abril</option>
            <option>Mayo</option>
            <option>Junio</option>
            <option>Julio</option>
            <option>Agosto</option>
            <option>Septiembre</option>
            <option>Octubre</option>
            <option>Noviembre</option>
            <option>Diciembre</option>
          </select>
        </label>

        <div className="flex flex-col max-h-[250px]overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-stone-200">
          <table className="table-auto items-center">
            <thead className="text-center justify-center items-center text-sm font-bold text-gray-900 uppercase">
              <tr>
                <th className="px-4">Tipo</th>
                <th className="px-8">Código</th>
                <th>Nombre</th>
                <th className="px-4">Mes</th>
                <th className="px-2">
                  <AiOutlineWarning
                    data-tooltip-id="botonInfo"
                    className="w-10 h-10"
                  />
                  <Tooltip
                    id="botonInfo"
                    style={{ height: "170px", width: "300px" }}
                    effect="float"
                  >
                    <span className="flex items-center my-2">
                      <div className="w-10 h-10 rounded-full bg-green-400"></div>
                      <label className="ml-8">Produccion vigente</label>
                    </span>
                    <span className="flex items-center my-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-300"></div>
                      <label className="ml-2">
                        Produccion cerca a finalizar
                      </label>
                    </span>
                    <span className="flex items-center my-2">
                      <div className="w-10 h-10 rounded-full bg-red-500"></div>
                      <label className="ml-8">Produccion finalizada</label>
                    </span>
                  </Tooltip>
                </th>
                <th>¿Completada?</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((production, index) => {
                // Calcula la semaforización basada en el mes de la producción
                const semaforizacion = calculateSemaforizacion(production.mes);
                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-gray-900 hover:text-white transition duration-200 group`}
                  >
                    <td className="text-center whitespace-normal max-h-16">
                      {production.tipo}
                    </td>
                    <td className="text-center whitespace-normal max-h-16	">
                      {production.codigo}
                    </td>
                    <td className="text-center whitespace-normal max-h-16	">
                      {production.nombre}
                    </td>
                    <td className="text-center whitespace-normal max-h-16	">
                      {production.mes}
                    </td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`w-10 h-10 m-2 rounded-full inline-block ${
                          semaforizacion === "verde"
                            ? "bg-green-400"
                            : semaforizacion === "amarillo"
                            ? "bg-yellow-300"
                            : "bg-red-500"
                        }`}
                      ></span>
                    </td>
                    <td className="text-center whitespace-normal max-h-16 items-center justify-center">
                      <button
                        className="hover:bg-gray-700 hover:shadow-white text-gray-800 font-bold rounded-lg p-2 hover:scale-125 duration-200  "
                        type="button"
                        onClick={() => removeMaintenance(production.codigo)}
                      >
                        <AiOutlineCheck
                          size={32}
                          className="group-hover:fill-white"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Return onClick={handleReturn} />
    </CardComponent>
  );
};

export default Maintenance;
