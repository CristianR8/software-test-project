import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; // Utilizar db
import { deleteDoc } from "firebase/firestore";
import CardComponent from "./CardComponent";
import Return from "./Return";
import Swal from "sweetalert2";

const Cash = ({}) => {
  const { register, handleSubmit, reset } = useForm();
  const [saldos, setSaldos] = useState([]);

  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/");
  };

  // Función para obtener los saldos de Firestore y actualizar el estado
  useEffect(() => {
    const q = query(collection(firestore, "saldos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const saldosArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSaldos(saldosArray);
    });

    return () => unsubscribe(); // Detiene la escucha cuando el componente se desmonta
  }, []);

  const onSave = async (monto) => {
    try {
      const docRef = doc(collection(firestore, "saldos"));
      await setDoc(docRef, { monto: monto });
      Swal.fire({
        title: "Éxito!",
        text: "Saldo guardado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      });
      reset(); // Resetea el formulario después de guardar
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "No se pudo guardar el saldo",
        icon: "error",
        confirmButtonText: "Ok",
      });
      console.error("Error al guardar el saldo: ", error);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "saldos", id));
      Swal.fire({
        title: "Éxito!",
        text: "Saldo eliminado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "No se pudo eliminar el saldo",
        icon: "error",
        confirmButtonText: "Ok",
      });
      console.error("Error al eliminar el saldo: ", error);
    }
  };

  const onUpdateSaldo = async (montoProduccion) => {
    // Suponiendo que solo hay un documento en la colección 'saldos'
    // y conoces su ID o hay una lógica para determinar cuál saldo actualizar
    const saldosRef = collection(firestore, "saldos");
    const saldosSnap = await getDocs(saldosRef);

    if (!saldosSnap.empty) {
      // Suponiendo que solo hay un saldo, usa el primer documento
      const saldoDocRef = saldosSnap.docs[0].ref;
      const saldoActual = saldosSnap.docs[0].data().monto;
      const nuevoSaldo = parseFloat(saldoActual) - parseFloat(montoProduccion);

      try {
        // Actualiza el documento de saldo con el nuevo saldo
        await updateDoc(saldoDocRef, { monto: nuevoSaldo });
        console.log("Saldo actualizado con éxito");
      } catch (error) {
        console.error("Error al actualizar el saldo: ", error);
      }
    } else {
      console.log("No se encontraron documentos de saldo");
    }
  };

  const onSubmit = (data) => {
    onSave(data.monto); // Guarda la nueva producción
    onUpdateSaldo(data.monto); // Actualiza el saldo
  };

  return (
    <CardComponent>
      <div>
        <div className="bg-amber-400 text-gray-900 shadow-md rounded-lg px-8 p-4 mx-52 text-center">
          <p className="text-3xl font-mono 2xl:text-4xl font-semibold ">
            ASIGNACION DE SALDO
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl m-4 p-10 bg-white rounded shadow-xl mx-auto"
      >
        <div className="mb-6">
          <label
            htmlFor="monto"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Monto
          </label>
          <input
            type="number"
            {...register("monto", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingresa el monto"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            type="submit"
            className="px-4 py-2 bg-green-800 text-white text-base font-semibold rounded hover:bg-green-500 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Guardar Saldo
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2 flex justify-center items-center">
          Saldos Guardados:
        </h2>
        <ul className="w-full text-center">
          {saldos.map((saldo) => (
            <li key={saldo.id} className="list-disc list-inside m-4">
              {`Saldo: ${saldo.monto}`}
              <button
                onClick={() => onDelete(saldo.id)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 duration-200"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Return onClick={handleReturn}></Return>
    </CardComponent>
  );
};

export default Cash;
