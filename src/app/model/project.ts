import {Application} from './application';

export interface Project{
    name: string;
    apps: Array<Application>;
}