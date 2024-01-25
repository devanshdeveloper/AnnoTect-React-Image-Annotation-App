import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getInputAnnotationData, getOutputAnnotationData } from "./json-utils";

export async function exportFilesAsZIP(annotationsData, images) {
  const jszip = new JSZip();
  const filenames = Object.keys(annotationsData);
  filenames.forEach((filename) => {
    const image = images.find((image) => image.filename === filename);
    if (image) {
      jszip.file(filename, image.file);
    }

    jszip
      .folder("~Annotations")
      .file(
        `${filename}.json`,
        JSON.stringify(
          getOutputAnnotationData(annotationsData[filename], image),
          null,
          2
        )
      );
  });
  const content = await jszip.generateAsync({ type: "blob" });
  saveAs(content, images[0].filename);
}

export async function importImageFilesAsZIP(e) {
  const zipFile = e.target.files[0];
  try {
    const jsZIP = new JSZip();
    const zip = await jsZIP.loadAsync(zipFile);
    const imageFiles = [];
    let jsonFiles = {};
    for (const relativePath of Object.keys(zip.files)) {
      const zipEntry = zip.files[relativePath];
      if (!zipEntry.dir) {
        if (
          relativePath.startsWith("~Annotations/") &&
          relativePath.endsWith(".json")
        ) {
          const jsonObject = JSON.parse(await zipEntry.async("text"));
          jsonFiles[
            relativePath.replace("~Annotations/", "").replace(".json", "")
          ] = getInputAnnotationData(jsonObject);
        } else if (
          [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(
            `.${relativePath.toLowerCase().split(".").pop()}`
          )
        ) {
          const file = await zipEntry.async("blob");
          imageFiles.push({
            filename: zipEntry.name,
            file: file,
            image: URL.createObjectURL(file),
            size: [0, 0],
            rotate: 0,
          });
        }
      }
    }
    return { images: imageFiles, jsonFiles };
  } catch (error) {
    console.error("Error loading ZIP file:", error);
  }
}
