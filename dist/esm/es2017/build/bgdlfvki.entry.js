/*! Built with http://stenciljs.com */
import { h } from '../ionicpwaelements.core.js';

let ImageCapture = window.ImageCapture;
if (typeof ImageCapture === 'undefined') {
    ImageCapture = class {
        constructor(videoStreamTrack) {
            if (videoStreamTrack.kind !== 'video')
                throw new DOMException('NotSupportedError');
            this._videoStreamTrack = videoStreamTrack;
            if (!('readyState' in this._videoStreamTrack)) {
                this._videoStreamTrack.readyState = 'live';
            }
            this._previewStream = new MediaStream([videoStreamTrack]);
            this.videoElement = document.createElement('video');
            this.videoElementPlaying = new Promise(resolve => {
                this.videoElement.addEventListener('playing', resolve);
            });
            if (HTMLMediaElement) {
                this.videoElement.srcObject = this._previewStream;
            }
            else {
                this.videoElement.src = URL.createObjectURL(this._previewStream);
            }
            this.videoElement.muted = true;
            this.videoElement.setAttribute('playsinline', '');
            this.videoElement.play();
            this.canvasElement = document.createElement('canvas');
            this.canvas2dContext = this.canvasElement.getContext('2d');
        }
        get videoStreamTrack() {
            return this._videoStreamTrack;
        }
        getPhotoCapabilities() {
            return new Promise(function executorGPC(resolve, reject) {
                const MediaSettingsRange = {
                    current: 0, min: 0, max: 0,
                };
                resolve({
                    exposureCompensation: MediaSettingsRange,
                    exposureMode: 'none',
                    fillLightMode: ['none'],
                    focusMode: 'none',
                    imageHeight: MediaSettingsRange,
                    imageWidth: MediaSettingsRange,
                    iso: MediaSettingsRange,
                    redEyeReduction: false,
                    whiteBalanceMode: 'none',
                    zoom: MediaSettingsRange,
                });
                reject(new DOMException('OperationError'));
            });
        }
        setOptions(_photoSettings = {}) {
            return new Promise(function executorSO(_resolve, _reject) {
            });
        }
        takePhoto() {
            const self = this;
            return new Promise(function executorTP(resolve, reject) {
                if (self._videoStreamTrack.readyState !== 'live') {
                    return reject(new DOMException('InvalidStateError'));
                }
                self.videoElementPlaying.then(() => {
                    try {
                        self.canvasElement.width = self.videoElement.videoWidth;
                        self.canvasElement.height = self.videoElement.videoHeight;
                        self.canvas2dContext.drawImage(self.videoElement, 0, 0);
                        self.canvasElement.toBlob(resolve);
                    }
                    catch (error) {
                        reject(new DOMException('UnknownError'));
                    }
                });
            });
        }
        grabFrame() {
            const self = this;
            return new Promise(function executorGF(resolve, reject) {
                if (self._videoStreamTrack.readyState !== 'live') {
                    return reject(new DOMException('InvalidStateError'));
                }
                self.videoElementPlaying.then(() => {
                    try {
                        self.canvasElement.width = self.videoElement.videoWidth;
                        self.canvasElement.height = self.videoElement.videoHeight;
                        self.canvas2dContext.drawImage(self.videoElement, 0, 0);
                        resolve(window.createImageBitmap(self.canvasElement));
                    }
                    catch (error) {
                        reject(new DOMException('UnknownError'));
                    }
                });
            });
        }
    };
}
window.ImageCapture = ImageCapture;

class CameraPWA {
    constructor() {
        this.facingMode = 'user';
        this.showShutterOverlay = false;
        this.flashIndex = 0;
        this.cameraError = false;
        this.hasMultipleCameras = false;
        this.hasFlash = false;
        this.flashModes = [];
        this.flashMode = 'off';
    }
    async componentDidLoad() {
        if (this.isServer) {
            return;
        }
        this.defaultConstraints = {
            video: {
                facingMode: this.facingMode
            }
        };
        await this.queryDevices();
        await this.initCamera();
    }
    componentDidUnload() {
        this.stopStream();
        this.photoSrc && URL.revokeObjectURL(this.photoSrc);
    }
    hasImageCapture() {
        return 'ImageCapture' in window;
    }
    async queryDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.hasMultipleCameras = devices.filter(d => d.kind == 'videoinput').length > 1;
    }
    async initCamera(constraints) {
        if (!constraints) {
            constraints = this.defaultConstraints;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(Object.assign({ video: true, audio: false }, constraints));
            this.initStream(stream);
        }
        catch (e) {
            this.cameraError = true;
            this.cameraErrorString = this.buildError(e);
            console.error(e);
        }
    }
    buildError(e) {
        switch (e.name) {
            case "DevicesNotFoundError":
                return "No Camera found";
        }
        return "Unable to initialize Camera";
    }
    async initStream(stream) {
        this.stream = stream;
        this.videoElement.srcObject = stream;
        console.log(stream.getVideoTracks()[0]);
        if (this.hasImageCapture()) {
            this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
            await this.initPhotoCapabilities(this.imageCapture);
        }
        this.el.forceUpdate();
    }
    async initPhotoCapabilities(imageCapture) {
        const c = await imageCapture.getPhotoCapabilities();
        if (c.fillLightMode.length > 1) {
            this.flashModes = c.fillLightMode.map(m => m);
            if (this.flashMode) {
                this.flashMode = this.flashModes[this.flashModes.indexOf(this.flashMode)] || 'off';
                this.flashIndex = this.flashModes.indexOf(this.flashMode) || 0;
            }
            else {
                this.flashIndex = 0;
            }
        }
    }
    stopStream() {
        this.stream && this.stream.getTracks().forEach(track => track.stop());
    }
    async capture() {
        if (this.hasImageCapture()) {
            try {
                const photo = await this.imageCapture.takePhoto({
                    fillLightMode: this.flashModes.length > 1 ? this.flashMode : undefined
                });
                await this.flashScreen();
                this.promptAccept(photo);
            }
            catch (e) {
                console.error('Unable to take photo!', e);
            }
        }
    }
    async promptAccept(photo) {
        this.photo = photo;
        this.photoSrc = URL.createObjectURL(photo);
    }
    rotate() {
        this.stopStream();
        const track = this.stream && this.stream.getTracks()[0];
        if (!track) {
            return;
        }
        let c = track.getConstraints();
        let facingMode = c.facingMode;
        if (!facingMode) {
            let c = track.getCapabilities();
            facingMode = c.facingMode[0];
        }
        if (facingMode === 'environment') {
            this.initCamera({
                video: {
                    facingMode: 'user'
                }
            });
        }
        else {
            this.initCamera({
                video: {
                    facingMode: 'environment'
                }
            });
        }
    }
    setFlashMode(mode) {
        console.log('New flash mode: ', mode);
        this.flashMode = mode;
    }
    cycleFlash() {
        if (this.flashModes.length > 0) {
            this.flashIndex = (this.flashIndex + 1) % this.flashModes.length;
            this.setFlashMode(this.flashModes[this.flashIndex]);
        }
    }
    async flashScreen() {
        return new Promise((resolve, _reject) => {
            this.showShutterOverlay = true;
            setTimeout(() => {
                this.showShutterOverlay = false;
                resolve();
            }, 100);
        });
    }
    handleShutterClick(_e) {
        console.log();
        this.capture();
    }
    handleRotateClick(_e) {
        this.rotate();
    }
    handleClose(_e) {
        this.onPhoto.emit(null);
    }
    handleFlashClick(_e) {
        this.cycleFlash();
    }
    handleCancelPhoto(_e) {
        this.photo = null;
    }
    handleAcceptPhoto(_e) {
        this.onPhoto.emit(this.photo);
    }
    render() {
        return (h("div", { class: "camera-wrapper" },
            h("div", { class: "camera-header" },
                h("section", { class: "items" },
                    h("div", { class: "item close", onClick: e => this.handleClose(e) },
                        h("img", { src: `${this.publicPath}icons/exit.svg` })),
                    h("div", { class: "item flash", onClick: e => this.handleFlashClick(e) }, this.flashModes.length > 0 && (h("div", null,
                        this.flashMode == 'off' ? h("img", { src: `${this.publicPath}icons/flash-off.svg` }) : '',
                        this.flashMode == 'auto' ? h("img", { src: `${this.publicPath}icons/flash-auto.svg` }) : '',
                        this.flashMode == 'flash' ? h("img", { src: `${this.publicPath}icons/flash-on.svg` }) : ''))))),
            this.photo && (h("div", { class: "accept" },
                h("div", { class: "accept-image", style: { backgroundImage: `url(${this.photoSrc})` } }))),
            h("div", { class: "camera-video", style: { display: this.photo ? 'none' : '' } },
                this.cameraError && (h("div", { class: "error" }, this.cameraErrorString)),
                this.showShutterOverlay && (h("div", { class: "shutter-overlay" })),
                this.hasImageCapture() ? (h("video", { ref: (el) => this.videoElement = el, autoplay: true, playsinline: true })) : (h("canvas", { ref: (el) => this.canvasElement = el, width: "100%", height: "100%" }))),
            h("div", { class: "camera-footer" }, !this.photo ? ([
                h("div", { class: "shutter", onClick: (e) => this.handleShutterClick(e) },
                    h("div", { class: "shutter-button" })),
                h("div", { class: "rotate", onClick: (e) => this.handleRotateClick(e) },
                    h("img", { src: `${this.publicPath}icons/reverse-camera.svg` })),
                {}
            ]) : (h("section", { class: "items" },
                h("div", { class: "item accept-cancel", onClick: e => this.handleCancelPhoto(e) },
                    h("img", { src: `${this.publicPath}icons/retake.svg` })),
                h("div", { class: "item accept-use", onClick: e => this.handleAcceptPhoto(e) },
                    h("img", { src: `${this.publicPath}icons/confirm.svg` })))))));
    }
    static get is() { return "ion-pwa-camera"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "cameraError": {
            "state": true
        },
        "cameraErrorString": {
            "state": true
        },
        "el": {
            "elementRef": true
        },
        "facingMode": {
            "type": String,
            "attr": "facing-mode"
        },
        "flashIndex": {
            "state": true
        },
        "isServer": {
            "context": "isServer"
        },
        "photo": {
            "state": true
        },
        "photoSrc": {
            "state": true
        },
        "publicPath": {
            "context": "publicPath"
        },
        "showShutterOverlay": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "onPhoto",
            "method": "onPhoto",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host{--header-height:4em;--footer-height:9em;--shutter-size:6em;--icon-size-header:1.5em;--icon-size-footer:2.5em;--margin-size-header:1.5em;--margin-size-footer:2.0em;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,“Roboto”,“Droid Sans”,“Helvetica Neue”,sans-serif;display:block}.items,:host{width:100%;height:100%}.items{-webkit-box-sizing:border-box;box-sizing:border-box;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.items .item{-ms-flex:1;flex:1;text-align:center}.items .item:first-child{text-align:left}.items .item:last-child{text-align:right}.camera-wrapper{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%}.camera-header{color:#fff;background-color:#000;height:var(--header-height)}.camera-header .items{padding:var(--margin-size-header)}.camera-footer{position:relative;color:#fff;background-color:#000;height:var(--footer-height)}.camera-footer .items{padding:var(--margin-size-footer)}.camera-video{position:relative;-ms-flex:1;flex:1;overflow:hidden}.camera-video,video{background-color:#000}video{width:100%;height:100%;max-height:100%;min-height:100%;z-index:-1;-o-object-fit:cover;object-fit:cover}.shutter{position:absolute;left:50%;top:50%;width:var(--shutter-size);height:var(--shutter-size);margin-top:calc(var(--shutter-size) / -2);margin-left:calc(var(--shutter-size) / -2);border-radius:100%;background-color:#c6cdd8;padding:12px;-webkit-box-sizing:border-box;box-sizing:border-box}.shutter:active .shutter-button{background-color:#9da9bb}.shutter-button{background-color:#fff;border-radius:100%;width:100%;height:100%}.rotate{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;position:absolute;right:var(--margin-size-footer);top:0;height:100%;color:#fff}.rotate,.rotate img{width:var(--icon-size-footer)}.rotate img{height:var(--icon-size-footer)}.shutter-overlay{z-index:5;position:absolute;width:100%;height:100%;background-color:#000}.error{width:100%;height:100%;color:#fff;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.accept{background-color:#000;-ms-flex:1;flex:1}.accept .accept-image{width:100%;height:100%;background-position:50%;background-size:cover;background-repeat:no-repeat}.close img,.flash img{width:var(--icon-size-header);height:var(--icon-size-header)}.accept-cancel img,.accept-use img{width:var(--icon-size-footer);height:var(--icon-size-footer)}"; }
}

class CameraModalPWA {
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

export { CameraPWA as IonPwaCamera, CameraModalPWA as IonPwaCameraModal };
