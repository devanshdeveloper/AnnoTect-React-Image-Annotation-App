import { useState } from "react";
import { useMainContext } from "../context";
import Modal from "./Modal";
import { BsFiletypeJson } from "react-icons/bs";
import { MdFolderZip } from "react-icons/md";
import { downloadJSON, getOutputAnnotationData } from "../utils/json-utils";
import { exportFilesAsZIP } from "../utils/zip";

export default function ExportModal({ ...props }) {
  const {
    annotationsData,
    getCurrentImageFilename,
    images,
    setLoader,
    getCurrentImageData,
  } = useMainContext();
  const [selectFileError, setSelectFileError] = useState(null);


  return (
    <>
      <Modal {...props} hideClose={true}>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center gap-3"
          >
            Download current single JSON File.
            <div
              onClick={async () => {
                downloadJSON(
                  getOutputAnnotationData(
                    annotationsData[getCurrentImageFilename()],
                    getCurrentImageData()
                  ),
                  getCurrentImageFilename()
                );
              }}
              className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black"
            >
              <div className="flex items-center justify-center">
                <BsFiletypeJson className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
              </div>
            </div>
          </label>
          <div className="flex justify-center">OR</div>
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center gap-3"
          >
            Export as a ZIP
            <div
              onClick={async () => {
                setLoader({
                  loading: true,
                  text: "Compressing images and json files",
                  showLoader: true,
                });
                await exportFilesAsZIP(annotationsData, images, (error) => {
                  setSelectFileError(error.message);
                });
                setLoader({ loading: false });
              }}
              className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black"
            >
              <div className="flex items-center justify-center">
                <MdFolderZip className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
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
