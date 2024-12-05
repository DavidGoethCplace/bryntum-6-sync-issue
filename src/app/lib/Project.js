import { ProjectModel } from '@bryntum/gantt';

export default class Project extends ProjectModel {
    async sync() {
        console.log("sync change set: ", this.getChangesetPackage());
        return super.sync();
    }
}
