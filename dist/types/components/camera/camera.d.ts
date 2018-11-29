import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { FlashMode } from '../../definitions';
import './imagecapture';
export declare class CameraPWA {
    el: any;
    private isServer;
    private publicPath;
    facingMode: string;
    onPhoto: EventEmitter;
    photo: any;
    photoSrc: any;
    showShutterOverlay: boolean;
    flashIndex: number;
    cameraError: boolean;
    cameraErrorString: any;
    defaultConstraints: any;
    stream: MediaStream;
    imageCapture: any;
    videoElement: HTMLVideoElement;
    canvasElement: HTMLCanvasElement;
    hasMultipleCameras: boolean;
    hasFlash: boolean;
    flashModes: FlashMode[];
    flashMode: FlashMode;
    componentDidLoad(): Promise<void>;
    componentDidUnload(): void;
    hasImageCapture(): boolean;
    /**
     * Query the list of connected devices and figure out how many video inputs we have.
     */
    queryDevices(): Promise<void>;
    initCamera(constraints?: MediaStreamConstraints): Promise<void>;
    buildError(e: any): "No Camera found" | "Unable to initialize Camera";
    initStream(stream: MediaStream): Promise<void>;
    initPhotoCapabilities(imageCapture: any): Promise<void>;
    stopStream(): void;
    capture(): Promise<void>;
    promptAccept(photo: any): Promise<void>;
    rotate(): void;
    setFlashMode(mode: FlashMode): void;
    cycleFlash(): void;
    flashScreen(): Promise<{}>;
    handleShutterClick(_e: Event): void;
    handleRotateClick(_e: Event): void;
    handleClose(_e: Event): void;
    handleFlashClick(_e: Event): void;
    handleCancelPhoto(_e: Event): void;
    handleAcceptPhoto(_e: Event): void;
    render(): JSX.Element;
}
