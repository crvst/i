const createConsts = (module: string,
                      submodule: string,
                      ...actions: Array<string>) =>
  actions.reduce((acc, c) => {
    Object.defineProperty(acc, c, {
      value: `${module}/${submodule}/${c}`,
      enumerable: true,
    });
    return acc;
  }, {});

export default createConsts;
