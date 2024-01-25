import Modal from "./Modal";

export default function ConfirmationModal({
  annotationData,
  message,
  ...props
}) {
  return (
    <>
      <Modal {...props} text={props.title || "Confirm"}>
        <div>{message}</div>
        {annotationData && (
          <div className="max-h-[400px] w-full overflow-y-scroll">
            <pre>
              {typeof annotationData === "object" &&
                Object.keys(annotationData).map((filename) => (
                  <div>{filename}</div>
                ))}
            </pre>
          </div>
        )}
      </Modal>
    </>
  );
}
