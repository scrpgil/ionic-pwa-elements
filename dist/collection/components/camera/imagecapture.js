export let ImageCapture = window.ImageCapture;
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
