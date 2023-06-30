import { usePermissionStore } from '@/stores/permission';
export const btnShow = (tag: string) => {
    const permissionStore = usePermissionStore();
    return permissionStore.buttonList.includes(tag);
    // return true;
}