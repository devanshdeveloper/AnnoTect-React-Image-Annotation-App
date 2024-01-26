import { RxHamburgerMenu } from "react-icons/rx";
import { ReactPictureAnnotation } from "../reactpictureannotation";
import { useMainContext } from "../context";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getImageIndexValid } from "../utils";
import ImportModal from "../components/ImportModal";
import ExportModal from "../components/ExportModal";
// import JSONEditorModal from "../components/JSONEditorModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { defaultStyles } from "../utils/default";

export default function ImageAnnotator() {
  const {
    images,
    pageSize,
    annotationsData,
    onAnnotationsChange,
    setImages,
    loadPreviousAnnotationData,
    currentImageIndex,
    setCurrentImageIndex,
    getCurrentImageFilename,
    currentSeleted,
    setCurrentSelected,
  } = useMainContext();

  console.log(images , annotationsData);

  const onSelect = (selectedId) => {
    setCurrentSelected(selectedId);
  };

  const [modal, setModal] = useState({
    show: false,
    onSuccess: () => {},
    onClose: () => {},
  });
  const [importModal, setImportModal] = useState({
    show: false,
  });
  const [exportModal, setExportModal] = useState({
    show: false,
  });

  // const [jSONEditorModal, setJSONEditorModal] = useState({
  //   show: false,
  //   onSuccess: () => {},
  //   onClose: () => {},
  // });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const imagePreviewDiv = useRef();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Delete") {
        onAnnotationsChange((data) => {
          return {
            ...data,
            [getCurrentImageFilename()]: data[
              getCurrentImageFilename()
            ]?.filter((annotation) => annotation.id !== currentSeleted),
          };
        });
      } else if (e.code === "ArrowRight") {
        setCurrentImageIndex((prev) =>
          getImageIndexValid(prev + 1, images.length)
        );
      } else if (e.code === "ArrowLeft") {
        setCurrentImageIndex((prev) =>
          getImageIndexValid(prev - 1, images.length)
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    currentSeleted,
    onAnnotationsChange,
    getCurrentImageFilename,
    images.length,
    setCurrentImageIndex,
  ]);

  useEffect(() => {
    imagePreviewDiv.current.scroll({
      top: 121 * currentImageIndex,
      behavior: "smooth",
    });
  }, [currentImageIndex]);

  return (
    <div className="App">
      <ConfirmationModal
        {...{
          ...modal,
          closeModal: () => setModal({ ...modal, show: false }),
        }}
      />
      <ImportModal
        {...{
          ...importModal,
          closeModal: () => setImportModal({ ...importModal, show: false }),
        }}
      />
      <ExportModal
        {...{
          ...exportModal,
          closeModal: () => setExportModal({ ...exportModal, show: false }),
        }}
      />
      {/* <JSONEditorModal
        {...{
          ...jSONEditorModal,
          closeModal: () =>
            setJSONEditorModal({ ...jSONEditorModal, show: false }),
        }}
      /> */}
      <div className="absolute top-5 left-5 z-50">
        <button
          onClick={() => setIsImagePreviewOpen((prev) => !prev)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-3 rounded-md"
        >
          <RxHamburgerMenu size={22} />
        </button>
        <ul
          ref={imagePreviewDiv}
          className={`py-2 rounded-md text-sm min-w-[100px] h-[85vh] overflow-y-scroll bg-white shadow-lg absolute transition-all duration-200 top-16 ${
            isImagePreviewOpen ? "left-0" : "-left-96"
          } brand-scrollbar`}
        >
          {images.map((image, i) => {
            return (
              <div
                key={i}
                title={image.filename}
                className={` border rounded-md ${
                  currentImageIndex === i ? "border-black" : ""
                }`}
                onClick={() => setCurrentImageIndex(i)}
              >
                <img
                  className="w-[100px] h-[100px]"
                  src={image.image}
                  alt={image.filename}
                  onLoad={(e) => {
                    const cloneImages = [...images];
                    cloneImages[currentImageIndex] = {
                      ...cloneImages[currentImageIndex],
                      size: [e.target.naturalWidth, e.target.naturalHeight],
                    };
                    setImages(cloneImages);
                  }}
                />
              </div>
            );
          })}
        </ul>
      </div>

      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-3 rounded-md"
        >
          <RxHamburgerMenu size={22} />
        </button>
        <ul
          className={`py-2 rounded-md text-sm min-w-[150px] bg-white shadow-md absolute transition-all duration-200 top-16 ${
            isDropdownOpen ? "left-28" : "-left-20"
          }`}
        >
          {[
            {
              text: "Home",
              onPress: () => {
                setModal({
                  ...modal,
                  show: true,
                  message:
                    "Are you certain about returning to the home screen? Please note that your existing data will be lost.",
                  onSuccess() {
                    setImages([]);
                  },
                });
              },
            },
            {
              text: "Import",
              onPress: async () => {
                setImportModal({ ...importModal, show: true });
              },
            },
            {
              text: "Export",
              onPress: () => {
                setExportModal({
                  ...exportModal,
                  show: true,
                });
              },
            },
            // {
            //   text: "JSON Editor",
            //   onPress: () => {
            //     setJSONEditorModal({
            //       ...jSONEditorModal,
            //       show: true,
            //     });
            //   },
            // },
            {
              text: "Load Last Data",
              onPress: () => {
                const jsonData = loadPreviousAnnotationData();
                if (jsonData) {
                  setModal({
                    ...modal,
                    show: true,
                    annotationData: jsonData,
                    message:
                      "Are you sure you wish to proceed with loading these annotations? Previous data will be overwritten...",
                    onSuccess() {
                      onAnnotationsChange(jsonData);
                    },
                  });
                } else {
                  setModal({
                    ...modal,
                    title: "Alert",
                    show: true,
                    message: "No data found",
                  });
                }
              },
            },
            {
              text: "Exit",
              onPress: () => {
                console.log("closing");
                window.close();
              },
            },
          ].map((dropDownItem, i) => {
            return (
              <li key={i}>
                {dropDownItem.href ? (
                  <Link
                    className="px-5 py-3 hover:bg-indigo-50 w-full flex"
                    to={dropDownItem.href}
                  >
                    {dropDownItem.text}
                  </Link>
                ) : (
                  <button
                    className="px-5 py-3 hover:bg-indigo-50 w-full flex"
                    onClick={dropDownItem.onPress}
                  >
                    {dropDownItem.text}
                  </button>
                )}
              </li>
            );
          })}
          <li className="flex justify-around">
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  getImageIndexValid(prev - 1, images.length)
                )
              }
              className="text-xl"
            >
              -
            </button>
            <input
              value={currentImageIndex + 1}
              onChange={(e) => {
                setCurrentImageIndex(
                  getImageIndexValid(+e.target.value - 1, images.length)
                );
              }}
              className="focus:outline-none w-[100px] focus:bg-indigo-100 rounded-md bg-violet-50 text-black px-2 py-2 transition-all duration-200"
              type="number"
              min={1}
              max={images.length + 1}
            />
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  getImageIndexValid(prev + 1, images.length)
                )
              }
              className="text-xl"
            >
              +
            </button>
          </li>
        </ul>
      </div>
      <ReactPictureAnnotation
        image={images?.[currentImageIndex]?.image}
        onSelect={onSelect}
        selectedId={currentSeleted}
        onChange={(data) => {
          onAnnotationsChange({
            ...annotationsData,
            [getCurrentImageFilename()]: data,
          });
        }}
        annotationData={annotationsData[getCurrentImageFilename()]}
        width={pageSize.width}
        height={pageSize.height}
        annotationStyle={defaultStyles}
        // setImageProps={(props) => {
        //   const cloneImages = [...images];
        //   cloneImages[currentImageIndex] = {
        //     ...cloneImages[currentImageIndex],
        //     ...props,
        //   };
        //   setImages(cloneImages);
        // }}
      />
    </div>
  );
}
