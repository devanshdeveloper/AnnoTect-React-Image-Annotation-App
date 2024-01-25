import { useState } from "react";
import { useMainContext } from "../context";
import Modal from "./Modal";
import { BsImage } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { MdFolderZip } from "react-icons/md";
import { importImageFilesAsZIP } from "../utils/zip";
import { getImagesfromDirectory } from "../utils/files";

export default function SelectImageModal({ ...props }) {
  const { onImageChange, setImages, onAnnotationsChange, setLoader } =
    useMainContext();
  const [selectFileError, setSelectFileError] = useState(null);

  return (
    <>
      <Modal {...props} hideClose={true}>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center gap-3"
          >
            Select Images
            <div className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black">
              <div className="flex items-center justify-center">
                <BsImage className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
                <input
                  type="file"
                  accept="image/gif, image/jpeg, image/jpg, image/png"
                  className="absolute inset-0 z-10 opacity-0"
                  multiple
                  onChange={(e) => {
                    onImageChange(e);
                  }}
                />
              </div>
            </div>
          </label>
          {window.showDirectoryPicker && (
            <>
              {" "}
              <div className="flex justify-center">OR</div>
              <label
                htmlFor="imageInput"
                className="flex flex-col items-center gap-3"
              >
                Select a folder
                <div
                  onClick={async () => {
                    setLoader({
                      loading: true,
                      text: "Select a Folder which contains images. <br> Note : Images in the sub folder will not added",
                    });
                    const imageFiles = await getImagesfromDirectory();
                    if (imageFiles) {
                      if (imageFiles.length === 0) {
                        setLoader({ loading: false });
                        setSelectFileError("No images found in folder");
                        return;
                      }
                      setImages(imageFiles);
                      props.closeModal();
                    }
                    setLoader({ loading: false });
                  }}
                  className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black"
                >
                  <div className="flex items-center justify-center">
                    <FaFolder className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
                  </div>
                </div>
              </label>
            </>
          )}
          <div className="flex justify-center">OR</div>
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center gap-3"
          >
            Import using a ZIP
            <div className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black">
              <div className="flex items-center justify-center">
                <MdFolderZip className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
                <input
                  type="file"
                  className="absolute inset-0 z-10 opacity-0"
                  onChange={async (e) => {
                    setLoader({
                      loading: true,
                      showLoader: true,
                      text: "Decompressing ZIP Archive...",
                    });
                    const result = await importImageFilesAsZIP(e);
                    if (!result) {
                      setSelectFileError("Invalid ZIP file");
                      setLoader({ loading: false });
                      return;
                    }
                    setImages(result.images);
                    onAnnotationsChange(result.jsonFiles);
                    setLoader({ loading: false });
                    props.closeModal();
                  }}
                />
              </div>
            </div>
          </label>
          {selectFileError && (
            <div className="text-red-500"> {selectFileError} </div>
          )}
        </div>
      </Modal>
    </>
  );
}
