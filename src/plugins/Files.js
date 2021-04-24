export default class Files {
  static getComponents(files) {
    return files.keys().map((page) => {
      return this.getComponent(page, files);
    });
  }

  static getComponent(componentName, files) {
    return files(componentName);
  }
}
