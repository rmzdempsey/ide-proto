import {Application} from './application';

export interface Project{
    name: string;
    apps: Array<Application>;
}

export interface Project2{
    name: string;
    templateNames: Array<string>;
}