"use strict";


class LocalStorage {

    static init(storageName) {
        if (!localStorage.getItem(storageName)) {
            localStorage.setItem(storageName, true);
        }
    }

    static get(storageName) {
        const data = localStorage.getItem(storageName);
        return JSON.parse(data);
    }

    static set(storageName, data) {
        const storeData = JSON.stringify
        localStorage.setItem(storageName, data);
    }

}

export default LocalStorage;
