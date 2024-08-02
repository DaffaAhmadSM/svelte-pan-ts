function getValueByPath(obj, path) {
  try {
    let keys = path.split('.');
    let currentLevel = obj;
    for (let key of keys) {
      if (currentLevel && typeof currentLevel === 'object' && key in currentLevel) {
        currentLevel = currentLevel[key];
      } else {
        currentLevel = undefined;
        break;
      }
    }

    if (currentLevel === null) {
      return "N/A";
    }
    return currentLevel !== undefined && currentLevel !== null ? currentLevel : "No data";
  } catch (error) {
    console.error("Error accessing nested property:", error);
    return "No data";
  }
}

export {
  getValueByPath,
}