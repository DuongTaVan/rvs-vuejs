export default {
  // beforeMount(el, binding) {
  //   const clickOutsideEvent = (event) => {
  //     if (!el.contains(event.target) && el !== event.target) {
  //       binding.value(event);
  //     }
  //   };

  //   el.__vueClickEventHandler__ = clickOutsideEvent;
  //   document.addEventListener('click', clickOutsideEvent);
  // },
  // unmounted(el) {
  //   document.body.removeEventListener('click', el.__vueClickEventHandler__);
  // },
  mounted(el, binding) {
    console.log(binding)
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};
