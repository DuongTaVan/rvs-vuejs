import { createStore } from 'vuex';

const requireContext = require.context('./modules', false, /.*\.js$/);

const storeModule = requireContext
  .keys()
  .map((file) => [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)])
  .reduce((modules, [name, module]) => {
    if (module.namespaced === undefined) {
      module.namespaced = true;
    }

    return { ...modules, [name]: module };
  }, {});

const store = createStore({
  modules: storeModule
});

export default store;
