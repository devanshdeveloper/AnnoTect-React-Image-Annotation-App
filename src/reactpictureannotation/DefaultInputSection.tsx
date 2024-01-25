import { useState } from "react";
import { IAnnotation, IMetadata } from "./Annotation";
import { useMainContext } from "../context";
import DropdownInput from "./DropdownInput";
import CheckboxInput from "./DefaultCheckbox";
import Draggable from "react-draggable";

export interface IDefaultInputSection {
  metadata: IMetadata;
  placeholder?: string;
  onChange: (metadata: IMetadata) => void;
  onDelete: () => void;
  showInput: boolean;
  changeSelected: (id: string) => void;
}

export default function DefaultInputSection({
  metadata,
  onChange,
  onDelete,
  changeSelected,
}: IDefaultInputSection) {
  const [currentTab, setCurrentTab] = useState<string>("Inspector");
  const { getCurrentAnnotationData } = useMainContext();

  return (
    <Draggable>
      <div
        className={`bg-white w-[500px] relative shadow-lg rounded-md flex flex-col items-start p-5 gap-5 z-40 max-h-[90vh] ${
          currentTab === "Groups" ? "overflow-y-scroll" : ""
        } brand-scrollbar`}
      >
        <div className="flex justify-around w-full">
          {["Inspector", "Groups"].map((tab, i) => {
            return (
              <div
                key={i}
                onClick={() => setCurrentTab(tab)}
                className={`text-center ${
                  tab === currentTab ? "bg-indigo-500 text-white" : ""
                } hover:bg-indigo-700 hover:text-white   rounded-lg px-4 transition-all duration-200 py-2`}
              >
                {tab}
              </div>
            );
          })}
        </div>
        <div
          className={`${
            currentTab === "Inspector" ? "flex flex-col gap-3" : "hidden"
          } w-full`}
        >
          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-between">
              <DropdownInput
                name="type"
                id="inputType"
                value={metadata.type}
                onValueChange={(value) => {
                  onChange({ ...metadata, type: value });
                }}
                options={["Title", "Date", "Reference/Link", "Object"]}
                labelText="Type"
              />
              <div className="flex gap-2 items-center">
                <CheckboxInput
                  labelText="Entry"
                  checked={metadata.entry === "Yes"}
                  onChange={(e) => {
                    onChange({
                      ...metadata,
                      entry: e.target.checked ? "Yes" : "No",
                    });
                  }}
                />
                <CheckboxInput
                  labelText="Ghost"
                  checked={metadata.ghost === "Yes"}
                  onChange={(e) => {
                    onChange({
                      ...metadata,
                      ghost: e.target.checked ? "Yes" : "No",
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex gap-5">
              <label htmlFor="inputValue" className="mt-2">
                Value
              </label>
              <textarea
                id="inputValue"
                className="focus:outline-none outline-none bg-indigo-50 focus:bg-gray-50 rounded-md text-black px-2 py-2 transition-all duration-200 w-full"
                rows={3}
                value={metadata.value}
                onChange={(e) => {
                  onChange({ ...metadata, value: e.target.value });
                }}
              />
            </div>
            <div className="flex gap-5">
              <label htmlFor="inputText" className="mt-2">
                Text
              </label>
              <textarea
                id="inputText"
                className="focus:outline-none outline-none bg-indigo-50 focus:bg-gray-50 rounded-md text-black px-2 py-2 transition-all duration-200 w-full"
                value={metadata.text}
                onChange={(e) => {
                  onChange({ ...metadata, text: e.target.value });
                }}
              />
            </div>
            <div className="flex justify-between">
              <DropdownInput
                name="rotate"
                id="inputRotate"
                value={metadata.rotate}
                onValueChange={(value) => {
                  onChange({ ...metadata, rotate: value });
                }}
                options={["None", "90⁰ Right", "90⁰ Left", "180⁰"]}
                labelText="Rotate"
              />
              <div className="flex gap-2 items-center">
                <CheckboxInput
                  labelText="Check"
                  checked={metadata.check === "Yes"}
                  onChange={(e) => {
                    onChange({
                      ...metadata,
                      check: e.target.checked ? "Yes" : "No",
                    });
                  }}
                />
                <CheckboxInput
                  labelText="Force"
                  checked={metadata.force === "Yes"}
                  onChange={(e) => {
                    onChange({
                      ...metadata,
                      force: e.target.checked ? "Yes" : "No",
                    });
                  }}
                />
              </div>
            </div>
          </form>
          <div>
            <button
              className="bg-indigo-50 hover:bg-gray-50 text-black px-4 py-2 rounded-md"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
        <div
          className={`${
            currentTab === "Groups" ? "flex flex-col gap-3" : "hidden"
          } w-full`}
        >
          <div>{metadata.group}</div>
          <div className="flex flex-col relative left-2">
            {getCurrentAnnotationData().map((data: IAnnotation) => {
              if (metadata.group === data?.metadata?.group) {
                return (
                  <div
                    onClick={() => {
                      changeSelected(data.id);
                    }}
                  >
                    {data.metadata.value}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
