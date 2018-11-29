import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Modal } from '@ionic/core/dist/esm/es2017';
export declare class CameraModalPWA {
    onPhoto: EventEmitter;
    _modal: Modal;
    present(): Promise<void>;
    dismiss(): Promise<void>;
    render(): JSX.Element;
}
