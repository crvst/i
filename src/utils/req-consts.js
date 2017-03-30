import createConsts from './consts';

export default (module, submodule) => createConsts(module, submodule,
  'SEND',
  'SUCCEED',
  'REJECTED',
  'ERROR_ENCOUNTERED'
);
