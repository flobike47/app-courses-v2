import {Circle} from "@/models/Circle";

export class List {
    public id: number;
    public name: string;
    public color: string
    public circle: Circle


    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}