import { useState, ChangeEvent, InputHTMLAttributes } from "react";
import CancelWrapper from "./CancelWrapper";

interface DropdownInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: string) => void;
  options: string[];
  labelText: string;
}

function DropdownInput({
  onValueChange,
  options,
  labelText,
  ...props
}: DropdownInputProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);

  return (
    <>
      <CancelWrapper
        show={isOptionsOpen}
        cancelWrapperClick={() => setIsOptionsOpen(false)}
      />
      <div className="flex items-center gap-5 relative">
        <label htmlFor="inputType">{labelText}</label>
        <input
          {...props}
          autoComplete="off"
          onFocus={() => {
            setIsOptionsOpen(true);
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
          className="focus:outline-none outline-none bg-indigo-50 focus:bg-gray-50 rounded-md text-black px-2 py-2 transition-all duration-200"
        />
        <div
          className={`bg-white shadow-lg absolute top-10 animate-fade-in-down ${
            isOptionsOpen ? "block" : "hidden"
          } left-0 w-[300px] z-[99999] py-1 rounded-lg flex flex-col`}
        >
          {options.map((option, i) => (
            <div
              className="hover:cursor-pointer hover:bg-indigo-50 text-md p-3"
              onClick={() => {
                onValueChange(option);
                setIsOptionsOpen(false);
              }}
              key={i}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DropdownInput;
