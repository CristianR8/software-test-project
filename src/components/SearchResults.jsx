import React, { useState } from "react";
import DocsCard from "./DocsCard";
import { useNavigate } from "react-router-dom";
import NameCard from "./NameCard";
import useSearchStore from "../store/searchStore";
import Swal from "sweetalert2";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
// El resto de tu código...
import { firestore } from "../firebase"; // Asegúrate de que esta es la ruta correcta a tu configuración de Firebase

const SearchResults = ({ searchResults, resetSearch }) => {
  const [documentData, setDocumentData] = useState(null);

  const [selectedObject, setSelectedObject] = useState(searchResults);
  const { setSearch } = useSearchStore();

  const fetchDocument = async (codigo) => {
    // Crear una referencia a la colección
    const collectionRef = collection(firestore, "productions");
    // Crear una consulta
    const q = query(collectionRef, where("codigo", "==", codigo));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setDocumentData(docData);
      } else {
        console.log("Documento no encontrado");
        setDocumentData(null);
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      setDocumentData(null);
    }
  };

  const handleNameCardClick = (codigo) => {
    fetchDocument(codigo);
    // Establecer el objeto seleccionado en función del código
    const selectedResult = searchResults.find(
      (result) => result.codigo === codigo
    );
    setSelectedObject(selectedResult);

    setSearch(selectedResult.codigo, { value: "1", label: "Código" });
  };

  const deleteProduct = async (codigo) => {
    const docRef = doc(firestore, "productions", codigo);
    try {
      await deleteDoc(docRef);
      resetSearch();
      Swal.fire({
        title: "Eliminado",
        text: "El documento ha sido eliminado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      });

      // Llamada a la función para reiniciar la búsqueda o actualizar el estado
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el documento",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleUpdate = async (codigo, newMonto) => {
    const docRef = doc(firestore, "productions", codigo);

    try {
      await updateDoc(docRef, { monto: newMonto });
      console.log("Monto actualizado con éxito");
      // Aquí puedes actualizar el estado local si es necesario
      setDocumentData((prevDocumentData) => ({
        ...prevDocumentData,
        monto: newMonto,
      }));

      // Si 'searchResults' también se utiliza para mostrar datos, puedes actualizarlo así:
      const updatedSearchResults = searchResults.map((doc) =>
        doc.codigo === codigo ? { ...doc, monto: newMonto } : doc
      );
      setSelectedObject(updatedSearchResults);
      
    } catch (error) {
      console.error("Error al actualizar el monto:", error);
    }
  };

  return (
    <>
      {searchResults.constructor === Array &&
        selectedObject.constructor != Object && (
          <div className="justify-items-center w-screen">
            <div className="grid grid-cols-1 px-64 items-center gap-4">
              {searchResults.map((result, index) => (
                <NameCard
                  key={result.codigo}
                  title={result.nombre}
                  codigo={result.codigo}
                  onClick={() => handleNameCardClick(result.codigo)}
                  onDelete={deleteProduct}
                />
              ))}
            </div>
          </div>
        )}
      {selectedObject.constructor === Object && documentData && (
        <div className="justify-items-center w-screen">
          <div className="grid grid-cols-2 pr-12 items-center gap-4">
            <DocsCard
              key={documentData.codigo}
              document={documentData}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
