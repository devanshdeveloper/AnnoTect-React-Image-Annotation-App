import { createContext, useEffect, useState } from "react";
import useWinowSize from "../hooks/useWindowSize";
import { parseImages } from "../utils";
import { useNavigate } from "react-router-dom";
import { defaultMetaData } from "../utils/default";
import Loader from "../components/Loader";

export const MainContext = createContext();

export default function MainProvider({ children }) {
  // state
  const [images, setImages] = useState([]);
  const [pageSize, handleResize] = useWinowSize();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const [annotationsData, setAnnonationsData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSeleted, setCurrentSelected] = useState();
  const [formData, setFormData] = useState(defaultMetaData());
  const [loader, setLoader] = useState({ loading: false, text: "" });
  // setters
  function onAnnotationsChange(data) {
    setAnnonationsData(data);
  }

  function onAnnotationChange(filename, data) {
    onAnnotationsChange(
      Object.assign(
        {},
        {
          ...annotationsData,
          [filename]: data,
        }
      )
    );
  }

  function onImageChange(e) {
    setImages(parseImages(e));
  }

  // getters
  function getCurrentImageFilename() {
    return images[currentImageIndex]?.filename;
  }

  function getCurrentImageData() {
    return images[currentImageIndex];
  }

  function getCurrentAnnotationData() {
    return annotationsData[getCurrentImageFilename()];
  }

  // methods
  function loadPreviousAnnotationData() {
    return JSON.parse(localStorage.getItem("annotations"));
  }

  // useeffects
  useEffect(() => {
    navigate(images.length === 0 ? "/" : "/image-annotator");
  }, [images, navigate]);

  useEffect(() => {
    function handleSave() {
      localStorage.setItem("annotations", JSON.stringify(annotationsData));
    }
    window.addEventListener("beforeunload", handleSave);
    return () => window.removeEventListener("beforeunload", handleSave);
  }, [annotationsData]);

  useEffect(() => {
    let data = {};
    images.forEach((image) => {
      data[image.filename] = annotationsData[image.filename] || [];
    });
    onAnnotationsChange(data);
  }, [images]);

  return (
    <MainContext.Provider
      value={{
        loader,
        setLoader,
        formData,
        setFormData,
        pageSize,
        handleResize,
        onImageChange,
        images,
        setImages,
        settings,
        setSettings,
        annotationsData,
        onAnnotationChange,
        onAnnotationsChange,
        currentImageIndex,
        setCurrentImageIndex,
        currentSeleted,
        setCurrentSelected,
        getCurrentImageFilename,
        loadPreviousAnnotationData,
        getCurrentAnnotationData,
        getCurrentImageData,
      }}
    >
      {loader.loading && <Loader text={loader.text || ""} showLoader={loader.showLoader} />}
      {children}
    </MainContext.Provider>
  );
}
