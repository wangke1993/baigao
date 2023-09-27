export const MENU_CONF = {
    uploadImage: {
        server: "/api/file/upload",
        timeout: 5 * 1000, // 5s
        fieldName: "file",
        onBeforeUpload(file: any) {
            return file;
        },
        onProgress(progress: any) {
            console.log("onProgress", progress);
        },
        onSuccess(file: any, res: any) {
            console.log("onSuccess", file, res);
        },
        onFailed(file: any, res: any) {
            console.log("onFailed", file);
            console.log("onFailed", res);
        },
        customInsert(res: any, insertFn: any) {
            console.log("insertFn", insertFn);
            console.log("customInsert", res);
            const data = res.data;
            insertFn("/api" + data.url, data.fileName, "/api" + data.url);
        },
        onError(file: any, err: any, res: any) {
            console.error("onError", file, err, res);
        },
    },
    uploadVideo: {
        server: "/api/file/upload",
        timeout: 5 * 1000, // 5s
        fieldName: "file",
        onBeforeUpload(file: any) {
            return file;
        },
        onProgress(progress: any) {
            console.log("onProgress", progress);
        },
        onSuccess(file: any, res: any) {
            console.log("onSuccess", file, res);
        },
        onFailed(file: any, res: any) {
            console.log("onFailed", file);
            console.log("onFailed", res);
        },
        customInsert(res: any, insertFn: any) {
            console.log("insertFn", insertFn);
            console.log("customInsert", res);
            const data = res.data;
            insertFn("/api" + data.url, data.fileName, "/api" + data.url);
        },
        onError(file: any, err: any, res: any) {
            console.error("onError", file, err, res);
        },
    }
}