export class CameraModalPWA {
    async present() {
        var modalController = document.querySelector('ion-modal-controller');
        if (!modalController) {
            modalController = document.createElement('ion-modal-controller');
            document.body.appendChild(modalController);
        }
        await modalController.componentOnReady();
        const camera = document.createElement('ion-pwa-camera');
        camera.addEventListener('onPhoto', async (e) => {
            const photo = e.detail;
            this.onPhoto.emit(photo);
        });
        const modal = await modalController.create({
            component: camera
        });
        this._modal = modal;
        modal.present();
    }
    async dismiss() {
        this._modal && this._modal.dismiss();
    }
    render() {
        return (h("div", null));
    }
    static get is() { return "ion-pwa-camera-modal"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "dismiss": {
            "method": true
        },
        "present": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "onPhoto",
            "method": "onPhoto",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}
