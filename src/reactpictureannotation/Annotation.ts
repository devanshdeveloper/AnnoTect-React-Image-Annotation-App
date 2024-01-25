import { IShapeData } from "./Shape";

export interface IAnnotation<T = IShapeData> {
  id: string;
  mark: T;
  metadata?: IMetadata;
}

export interface IMetadata {
  check: "Yes" | "No";
  connect: "Yes" | "No";
  entry: "Yes" | "No";
  force: "Yes" | "No";
  ghost: "Yes" | "No";
  valid: "Yes" | "No";
  group: string;
  rotate: string;
  text: string;
  type: string;
  value: string;
}

export interface IAnnotations {
  annotations: IAnnotation[];
  size: number;
  rotate: string;
  path: string;
}
