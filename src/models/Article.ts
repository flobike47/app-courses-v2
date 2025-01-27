import {Unity} from "@/models/Unity";
import {Label} from "@/models/Label";

export class Article {
    public id: number;
    public name: string;
    public created_at: string
    public unity: Unity
    public unity_value: number
    public list: number
    public added_by: string
    public deleted: boolean
    public deleted_at: string
    public label: Label


    constructor(name: string, unity: Unity, unity_value: number, list: number, added_by: string, label: Label) {
        this.name = name;
        this.unity = unity;
        this.unity_value = unity_value;
        this.list = list;
        this.added_by = added_by;
        this.label = label;
    }
}