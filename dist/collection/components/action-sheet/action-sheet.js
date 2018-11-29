export class ActionSheetPWA {
    render() {
        return (h("div", null,
            h("ion-modal-controller", null)));
    }
    static get is() { return "ion-pwa-action-sheet"; }
    static get encapsulation() { return "shadow"; }
}
