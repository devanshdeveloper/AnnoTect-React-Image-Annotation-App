import { InputHTMLAttributes } from "react";

interface CheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
}

function CheckboxInput({ labelText, ...props }: CheckboxInputProps) {
  return (
    <div className="flex gap-2 items-center">
      <input type="checkbox" {...props} />
      <label>{labelText}</label>
    </div>
  );
}

export default CheckboxInput;
