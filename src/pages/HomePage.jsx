import { useState } from "react";
import SelectImageModal from "../components/SelectImageModal";

function HomePage() {
  const [selectImageModal, setSelectImageModal] = useState({
    show: false,
  });

  return (
    <>
      <SelectImageModal
        {...{
          ...selectImageModal,
          closeModal: () =>
            setSelectImageModal({ ...selectImageModal, show: false }),
        }}
      />
      <div className="flex flex-col-reverse justify-end lg:flex-row h-screen items-center p-5 md:p-10 lg:p-20 bg-gradient-to-b from-indigo-500/30 via-gray-200 to-gray-200">
        <div className="w-1/2 flex flex-col gap-10 justify-center items-start">
          <div>
            <div className="text-2xl lg:text-6xl font-bold text-indigo-500">
              Welcome to AnnoTect
            </div>
            <div className="text-md lg:text-2xl">
              Unlock the Power of Precision with AnnoTect - The Next Frontier in
              Image Annotation
            </div>
          </div>
          <div
            onClick={() => {
              setSelectImageModal({
                ...selectImageModal,
                show: true,
              });
            }}
            className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 rounded-md px-4 py-2 shadow-md text-white"
          >
            Get Started
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-10 justify-center items-center">
          <img
            className="h-[50vh]"
            src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/Annotation_re_h774.svg"
            alt="hero"
          />
        </div>
      </div>
    </>
  );
}

export default HomePage;
