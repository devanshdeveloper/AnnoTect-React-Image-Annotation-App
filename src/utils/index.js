export const parseImages = (event) => {
  if (!event.target.files) return;
  return [...event.target.files].map((file) => {
    return {
      image: URL.createObjectURL(file),
      filename: file.name,
      file,
      size: [0, 0],
    };
  });
};

export function log(arg) {
  return arg;
}

export function getImageIndexValid(newIndex, totalImages) {
  return newIndex < 0 ? 0 : Math.min(newIndex, totalImages - 1);
}

export function isObjectValidAsDefault(defaultObject, data) {
  if (typeof defaultObject !== "object" || typeof data !== "object") return;
  const defaultKeys = Object.keys(defaultObject);
  for (let i = 0; i < defaultKeys.length; i++) {
    const key = defaultKeys[i];
    if (data[key] === undefined || data[key] === null) {
      return false;
    }
  }
  return true;
}
