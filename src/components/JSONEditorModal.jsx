import Modal from "./Modal";
import { useMainContext } from "../context";
import { useEffect, useState } from "react";
import {
  getInputAnnotationData,
  getOutputAnnotationData,
  parseJSON,
} from "../utils/json-utils";

export default function JSONEditorModal({ ...props }) {
  const {
    annotationsData,
    onAnnotationChange,
    getCurrentImageFilename,
    getCurrentImageData,
  } = useMainContext();
  const [JSONString, setJSONString] = useState();
  const [JSONError, setJSONError] = useState();

  useEffect(() => {
    if (!props.show) return;

    setJSONString(
      JSON.stringify(
        getOutputAnnotationData(
          annotationsData[getCurrentImageFilename()],
          getCurrentImageData()
        ),
        null,
        2
      )
    );
  }, [annotationsData, props.show]);

  return (
    <>
      <Modal
        {...props}
        text="JSON Editor"
        onSuccess={() => {
          if (JSONError) return true;
          onAnnotationChange(
            getCurrentImageFilename(),
            getInputAnnotationData(JSON.parse(JSONString))
          );
        }}
      >
        <textarea
          className="w-full h-[400px]"
          value={JSONString}
          onChange={(e) => {
            setJSONString(e.target.value);
            const result = parseJSON(e.target.value);
            if (result.isValid) setJSONError(null);
            else setJSONError(result.error);
          }}
        />
        <div className="text-red-500">{JSONError}</div>
      </Modal>
    </>
  );
}
