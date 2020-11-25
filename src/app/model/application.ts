import { Template } from './template';


export interface Application{
    branches: Array<string>;
    currentBranch:string;
    template: Template;
}