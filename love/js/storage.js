// js/storage.js - Quản lý lưu trữ dữ liệu offline (LocalStorage + IndexedDB cho ảnh dung lượng lớn)

class LoveStorage {
    constructor() {
        this.dbName = 'GnoulMinyuLoveDB';
        this.dbVersion = 1;
        this.db = null;
        this.initIndexedDB();
    }

    // Khởi tạo IndexedDB để lưu ảnh và media không bị giới hạn 5MB của LocalStorage
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.warn('Trình duyệt không hỗ trợ IndexedDB, dùng LocalStorage');
                resolve(null);
                return;
            }
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('photos')) {
                    db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('chat_media')) {
                    db.createObjectStore('chat_media', { keyPath: 'id' });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            request.onerror = (e) => {
                console.error('Lỗi khởi tạo IndexedDB:', e);
                resolve(null);
            };
        });
    }

    // Lưu ảnh vào IndexedDB
    async savePhoto(item) {
        if (!this.db) await this.initIndexedDB();
        if (!this.db) return null;

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('photos', 'readwrite');
            const store = tx.objectStore('photos');
            const req = store.add({
                ...item,
                createdAt: item.createdAt || new Date().toISOString()
            });

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    // Lấy tất cả ảnh đã lưu
    async getPhotos() {
        if (!this.db) await this.initIndexedDB();
        if (!this.db) return [];

        return new Promise((resolve) => {
            const tx = this.db.transaction('photos', 'readonly');
            const store = tx.objectStore('photos');
            const req = store.getAll();

            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    }

    // Xóa ảnh
    async deletePhoto(id) {
        if (!this.db) await this.initIndexedDB();
        if (!this.db) return false;

        return new Promise((resolve) => {
            const tx = this.db.transaction('photos', 'readwrite');
            const store = tx.objectStore('photos');
            const req = store.delete(id);

            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
        });
    }

    // LocalStorage Helpers
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem('gm_' + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Lỗi đọc LocalStorage:', e);
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem('gm_' + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Lỗi ghi LocalStorage:', e);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem('gm_' + key);
            return true;
        } catch (e) {
            return false;
        }
    }
}

window.loveStorage = new LoveStorage();
