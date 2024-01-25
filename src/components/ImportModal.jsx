import { useState } from "react";
import { useMainContext } from "../context";
import Modal from "./Modal";
import { BsFiletypeJson } from "react-icons/bs";

import { FaFolder } from "react-icons/fa";
import { getInputAnnotationData } from "../utils/json-utils";
import { getJSONFilesFromDirectory, loadFile } from "../utils/files";

export default function ImportModal({ ...props }) {
  const { onAnnotationsChange, annotationsData, setLoader } = useMainContext();
  const [selectFileError, setSelectFileError] = useState(null);

  return (
    <>
      <Modal {...props} hideClose={true}>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="imageInput"
            className="flex flex-col items-center gap-3"
          >
            Select JSON files
            <div className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-black transition-all hover:border-black">
              <div className="flex items-center justify-center">
                <BsFiletypeJson className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-black-200" />
                <input
                  type="file"
                  accept="application/JSON"
                  className="absolute inset-0 z-10 opacity-0"
                  multiple
                  onChange={(e) => {
                    const files = [...e.target.files];
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const filename = file.name.replace(".json", "");
                        onAnnotationsChange({
                          ...annotationsData,
                          [filename]:
                            getInputAnnotationData(JSON.parse(reader.result)) ||
                            [],
                        });
                        props.closeModal();
                      };
                      reader.readAsText(file);
                    });
                  }}
                />
              </div>
            </div>
          </label>
          {window.showDirectoryPicker && (
            <>
              <div className="flex justify-center">OR</div>
              <label
                htmlFor="imageInput"
                className="flex flex-col items-center gap-3"
              >
                Select a folder
                <div
                  onClick={async () => {
                    try {
                      setLoader({ loading: true });
                      const jsonFiles = await getJSONFilesFromDirectory();
                      if (!jsonFiles) {
                        setLoader({ loading: false });
                        setSelectFileError("No JSON Files Found");
                        return;
                      }
                      const dataObj = {};
                      for (let i = 0; i < jsonFiles.length; i++) {
                        const jsonFile = jsonFiles[i];
                        dataObj[jsonFile.jsonFilename.replace(".json", "")] =
                          getInputAnnotationData(jsonFile.jsonData) || [];
                      }
                      onAnnotationsChange({
                        ...annotationsData,
                        ...dataObj,
                      });
                      props.closeModal();
                      setLoader({ loading: false });
                    } catch (e) {
                      setLoader({ loading: false });
                      setSelectFileError(e.message);
                    }
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
          {selectFileError && (
            <div className="text-red-500"> {selectFileError} </div>
          )}
        </div>
      </Modal>
    </>
  );
}
