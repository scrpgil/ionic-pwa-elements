import './imagecapture';
export class CameraPWA {
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
        else {
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
    static get style() { return "/**style-placeholder:ion-pwa-camera:**/"; }
}
