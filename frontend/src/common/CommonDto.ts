export class SelectDto<T> {
    label!: string;
    value!: string;
    data?: T;
    constructor(label: string, value: string, data?: T) {
        this.label = label;
        this.value = value;
        this.data = data;
    }
}