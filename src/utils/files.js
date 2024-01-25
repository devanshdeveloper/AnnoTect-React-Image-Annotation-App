export const loadFile = async () => {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: true,
      types: [
        {
          accept: {
            "application/json": [".json"],
          },
        },
      ],
      excludeAcceptAllOption: true,
    });
    const file = await fileHandle.getFile();
    const blob = await file.text();
    return { jsonFilename: file.name, jsonData: JSON.parse(blob) };
  } catch (error) {
    console.error(error);
  }
};
export async function saveJSONFile(data) {
  let saveFile;
  try {
    saveFile = await window.showSaveFilePicker({
      suggestedName: "data-1.json",
    });
    if ((await saveFile.queryPermission()) === "granted") {
      const writable = await saveFile.createWritable();
      await writable.write(JSON.stringify(data));
      await writable.close();
    }
    return saveFile;
  } catch (e) {
    console.log(e);
  }
}

export async function getImagesfromDirectory() {
  try {
    const directoryHandle = await window.showDirectoryPicker();
    let files = [];

    for await (const value of directoryHandle.values()) {
      const file = await value.getFile();
      if (file.type.startsWith("image/")) {
        files.push({
          image: URL.createObjectURL(file),
          filename: value.name,
          file,
          size : [0 , 0],
        });
      }
    }
    return files;
  } catch (error) {
    console.error("Error getting directory handle:", error);
  }
}


export async function getJSONFilesFromDirectory() {
  try {
    const directoryHandle = await window.showDirectoryPicker();
    let files = [];

    for await (const value of directoryHandle.values()) {
      const file = await value.getFile();
      const blob = await file.text();
      files.push({ jsonFilename: file.name, jsonData: JSON.parse(blob) });
    }
    return files;
  } catch (error) {
    console.error("Error getting directory handle:", error);
  }
}
