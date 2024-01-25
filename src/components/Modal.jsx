import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({
  show,
  text,
  children,
  closeModal,
  onSuccess,
  hideClose,
}) {
  return (
    <div
      className={`fixed ${
        show ? "top-0" : "top-[100%]"
      } left-0 z-[100] flex h-screen w-screen items-center justify-center bg-gray-500/90 p-6 transition-all duration-200`}
    >
      <div className="brand-scrollbar relative max-h-full w-[min(500px,95vw)] overflow-auto rounded-2xl  bg-white p-10 text-left shadow-lg transition-all duration-200">
        <AiOutlineClose
          className="absolute right-5 top-5 cursor-pointer text-xl opacity-60 transition-all duration-200 hover:opacity-100"
          onClick={closeModal}
        />
        <div className="flex w-full flex-col items-center gap-4">
          {text && (
            <p className="max-w-[368px] text-center text-2xl font-medium lg:text-left">
              {text}
            </p>
          )}
          {children}
        </div>
        <div className="mt-8 flex justify-end gap-2 bg-white">
          {!hideClose && (
            <button
              className="bg-gray-500 hover:bg-gray-600 transition-all duration-200 rounded-md px-4 py-2 shadow-md text-white"
              onClick={() => {
                closeModal();
              }}
            >
              No
            </button>
          )}
          {onSuccess && (
            <button
              className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 rounded-md px-4 py-2 shadow-md text-white"
              onClick={() => {
                const notClose = onSuccess();
                if (notClose) return;
                closeModal();
              }}
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
