import * as PNotifyMobile from '@pnotify/mobile/';
import * as PNotifyCountdown from '@pnotify/countdown';
import { defaultModules } from '@pnotify/core';
defaultModules.set(PNotifyMobile, {});
export default {
  imagesAreOver: {
    type: 'notice',
    title: 'Images are over',
    delay: 3000,
    width: '300px',
    modules: new Map([...defaultModules, [PNotifyCountdown, {}]]),
  },
  incorrectQuery: {
    type: 'error',
    title: 'Not found images',
    text: 'Please, enter correct query',
    delay: 3000,
    width: '300px',
    modules: new Map([...defaultModules, [PNotifyCountdown, {}]]),
  },
  notMachResults: {
    type: 'error',
    title: 'Not found images',
    text: 'Please, enter query',
    delay: 3000,
    width: '300px',
    modules: new Map([...defaultModules, [PNotifyCountdown, {}]]),
  },
  successResult: {
    type: 'success',
    title: 'Found 12 images',
    delay: 3000,
    width: '300px',
    modules: new Map([...defaultModules, [PNotifyCountdown, {}]]),
  },
};
