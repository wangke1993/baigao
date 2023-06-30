<template>
    <div class="image-box" v-if="isImage">
        <div class="top">
            <button class="btn" @click="zoomIn">放大</button>
            <button class="btn" @click="zoomOut">缩小</button>
            <button class="btn" @click="rotate">旋转</button>
        </div>
        <img :src="imgSrc" :style="{ transform: 'rotate(' + rotateDeg + 'deg) scale(' + scale + ')' }">
    </div>
    <DocumentEditor v-else id="docEditor" :documentServerUrl="documentServerUrl" :config="config" />
</template>
<script lang="ts" setup>
import { DocumentEditor } from "@onlyoffice/document-editor-vue";
import { ref } from "vue";
import { useRoute } from 'vue-router';

// 预览示例代码
// const word = ['doc', 'docm', 'docx', 'docxf', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'fb2', 'htm', 'html', 'mht', 'odt', 'oform', 'ott', 'oxps', 'pdf', 'rtf', 'txt', 'djvu', 'xml', 'xps'];
// const cell = ['csv', 'fods', 'ods', 'ots', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx'];
// const slide = ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx']
// const image = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
// const res = await FileUploadControllerDownPrivateTemp(fileUUID, { responseType: "blob", timeout: 3600000 });
// if (res.data.type == 'application/json') {
//     const file = new FileReader();
//     file.readAsText(res.data, 'utf-8');
//     file.onload = function () {
//         const { data: { viewUUID, fileType, file: viewFile } } = JSON.parse(file?.result ? file?.result.toString() : "");
//         if (fileType === 'pdf') {
//             window.open(`http://211.149.135.249:888/api/file/privateTemp/${viewUUID}`)
//         } else {
//             let documentType = 'word';
//             if (cell.includes(fileType)) {
//                 documentType = 'cell';
//             } else if (slide.includes(fileType)) {
//                 documentType = 'slide';
//             } else if (image.includes(fileType)) {
//                 documentType = 'image';
//             }
//             // alertWarning(message);
//             const query = {
//                 fileType,
//                 key: viewUUID,
//                 title: `${form.value.name}-${viewFile.fileName}`,
//                 url: `http://211.149.135.249:888/api/file/privateTemp/${viewUUID}`,
//                 documentType
//             }
//             window.open(`${window.location.origin}/documentView?${qs.stringify(query)}`)
//         }
//     }
// } else {
//     const blob = new Blob([res.data], {
//         type: res?.headers['content-type'],
//     });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     const fileType = decodeURI(atob(res?.headers['file-name'])).split('.').pop() ?? 'xxx';
//     const webOpen = ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'txt'];
//     if (webOpen.includes(fileType)) {
//         window.open(a.href);
//     } else {
//         a.download = `${form.value.name}_${decodeURI(atob(res?.headers['file-name']))}`;
//         a.style.display = "none";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//     }
// }
const route = useRoute()
const isImage = ref(route.query.documentType === 'image');
const imgSrc = `${route.query.url}`;
const rotateDeg = ref(0);
const scale = ref(1);
// FIXME:上线后请修改为自己的onlyOffice地址
const documentServerUrl = ref('http://localhost:666/')
const rotate = () => {
    rotateDeg.value += 90;
}
const zoomIn = () => {
    scale.value += 0.1;
};
const zoomOut = () => {
    scale.value -= 0.1;
};
const config = ref({
    document: {
        fileType: route.query.fileType,
        key: route.query.key,
        title: route.query.title,
        url: route.query.url
    },
    documentType: route.query.documentType,
    editorConfig: {
        "lang": "zh-CN",
        "mode": "edit",
    },
    lang: "zh-CN",
} as any)

</script>
<style lang="scss" scoped>
.image-box {
    display: flex;
    align-items: center;
    flex-direction: column;

    .top {
        position: relative;
        z-index: 999;

        .btn {
            width: 100px;
            border: none;
            margin: 8px;
            padding: 8px;
        }
    }
}
</style>