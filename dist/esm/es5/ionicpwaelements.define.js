
// ionicpwaelements: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './ionicpwaelements.core.js';
import {
  ActionSheetPWA,
  AnimationControllerImpl,
  Backdrop,
  CameraModalPWA,
  CameraPWA,
  Modal,
  ModalController
} from './ionicpwaelements.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [
    ActionSheetPWA,
    AnimationControllerImpl,
    Backdrop,
    CameraModalPWA,
    CameraPWA,
    Modal,
    ModalController
  ], opts);
}
