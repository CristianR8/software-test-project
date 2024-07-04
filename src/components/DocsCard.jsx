import React, { useState, useEffect } from "react";
import { query, where, addDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from "../firebase"; 

const DocsCard = ({ document, onUpdate }) => {
  const [transactionType, setTransactionType] = useState("ingreso"); // 'ingreso' o 'gasto'
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Suponiendo que 'document' ya contiene toda la información necesaria.
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConceptChange = (e) => setConcept(e.target.value);

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      alert("Por favor, introduce un número válido.");
      return;
    }

    // Preparar la transacción para añadir a Firestore
    const newTransaction = {
      codigoProducto: docData.codigo,
      type: transactionType,
      amount: numericAmount,
      concept,
    };

    try {
      // Agregar la nueva transacción a la colección `transacciones`
      await addDoc(collection(firestore, "transacciones"), newTransaction);

      // Actualizar la lista de transacciones en el estado local
      setTransactions([...transactions, newTransaction]);

      // Aquí podrías querer también actualizar el monto en el documento de `producciones`
      // pero eso dependerá de cómo quieres manejar los montos totales
    } catch (error) {
      console.error("Error al agregar la transacción:", error);
    }

    setTransactions([
      ...transactions,
      { type: transactionType, amount: numericAmount, concept },
    ]);

    // Actualiza el monto total
    const newMonto =
      transactionType === "ingreso"
        ? docData.monto + numericAmount
        : docData.monto - numericAmount;
    onUpdate(document.codigo, newMonto);

    // Limpiar los campos del formulario
    setAmount("");
    setConcept("");
  };

  const docData = document;

  // Dentro de tu componente DocsCard
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // Suponiendo que cada transacción es un documento en la colección `transacciones`
        // y tiene un campo `codigoProducto` que corresponde al `codigo` del documento de `producciones`
        const q = query(
          collection(firestore, "transacciones"),
          where("codigoProducto", "==", docData.codigo)
        );
        const querySnapshot = await getDocs(q);

        const loadedTransactions = [];
        querySnapshot.forEach((doc) => {
          loadedTransactions.push(doc.data());
        });

        // Establecer el estado de transacciones con las transacciones cargadas
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
      }
    };

    loadTransactions();
  }, [docData.codigo]);

  return (
    <div className="flex justify-center items-center w-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl bg-white shadow-md rounded-lg">
        <div className="bg-green-800 text-white hover:scale-110 flex justify-center items-center transition-all duration-700 shadow-lg rounded-lg overflow-hidden my-2 p-4">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2">{docData.nombre}</h2>
            <div className="text-lg mb-1">
              <strong>Código:</strong> {docData.codigo}
            </div>
            <div className="text-lg mb-1">
              <strong>Monto:</strong> ${docData.monto}
            </div>
            <div className="text-lg mb-1">
              <strong>Ciudad:</strong> {docData.ciudad}
            </div>
            <div className="text-lg mb-1">
              <strong>Tipo:</strong> {docData.tipo}
            </div>
            <div className="text-lg mb-1">
              <strong>Mes:</strong> {docData.mes}
            </div>
            <div className="text-lg mb-1">
              <strong>Fecha de Creación:</strong>
              {docData.fechaCreacion
                ? new Date(
                    docData.fechaCreacion.seconds * 1000
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Transacción
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="ingreso"
                checked={transactionType === "ingreso"}
                onChange={handleTransactionTypeChange}
              />
              <span className="ml-2">Ingreso</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio"
                value="gasto"
                checked={transactionType === "gasto"}
                onChange={handleTransactionTypeChange}
              />
              <span className="ml-2">Gasto</span>
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Monto
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Monto"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-800 hover:bg-green-600 transition all duration-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar Monto
            </button>
          </div>
        </form>
        <div className="mt-4 p-4">
          <h3 className="text-lg font-semibold">Transacciones:</h3>
          <ul>
            {transactions.map((transaction, index) => (
              <li
                key={index}
                className={`${
                  transaction.type === "ingreso"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type.toUpperCase()}: ${transaction.amount} -{" "}
                {transaction.concept}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocsCard;
