export function getOutputAnnotationData(jsonData, image) {
  if (!jsonData) return;
  const height = image.size[1] || 0;
  const width = image.size[0] || 0;
  let data = {};
  data.annotations = jsonData.map((annotation) => {
    let annotationData = {};
    annotationData.metadata = annotation.metadata;
    annotationData.frame = `{{${annotation.mark.x}, ${
      height - annotation.mark.y - annotation.mark.height
    }}, {${annotation.mark.width}, ${annotation.mark.height}}}`;
    annotationData.points = annotation.points || [];
    annotationData.type = annotation.type || "AnnotationRectangle";
    annotationData.uuid = annotation.id;
    return annotationData;
  });
  data.path = "";
  data.size = `{${width}, ${height}}`;
  data.rotation = 0;
  return data;
}

export function getInputAnnotationData(jsonData) {
  if (!jsonData) return [];

  // [width, height]
  const [width, height] = jsonData.size
    .replace(/[{}]/g, "")
    .split(",")
    .map((value) => parseFloat(value.trim()));

  const inputData = jsonData.annotations.map((annotation) => {
    const frameValues = annotation.frame
      .replace(/[{}]/g, "")
      .split(",")
      .map((value) => parseFloat(value.trim()));

    let data = {};
    data.id = annotation.uuid;
    data.metadata = annotation.metadata;
    data.type = annotation.type || "AnnotationRectangle";
    data.points = annotation.points || [];
    data.mark = {
      x: frameValues[0],
      y: height - frameValues[1] - frameValues[3],
      width: frameValues[2],
      height: frameValues[3],
      type: "RECT",
    };
    return data;
  });
  return inputData;
}

export function isValidJSONData(jsonData) {
  return jsonData.every((obj) => obj.hasOwnProperty("id"));
}

export function parseJSON(jsonString) {
  let parsedObject;
  try {
    parsedObject = JSON.parse(jsonString);
    return { isValid: true, parsedObject };
  } catch (error) {
    return { isValid: false, error: error.message, parsedObject };
  }
}

export function downloadJSON(json, filename = "image.jpg") {
  const jsonString = JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
