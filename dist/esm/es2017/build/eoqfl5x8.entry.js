/*! Built with http://stenciljs.com */
import { h } from '../ionicpwaelements.core.js';

class ActionSheetPWA {
    render() {
        return (h("div", null,
            h("ion-modal-controller", null)));
    }
    static get is() { return "ion-pwa-action-sheet"; }
    static get encapsulation() { return "shadow"; }
}

export { ActionSheetPWA as IonPwaActionSheet };
