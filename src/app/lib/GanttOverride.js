import { Gantt, Override } from '@bryntum/gantt';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class GanttOverride  {

    static get target() {
        return {
          class: Gantt,
        };
      }

    async addTask(referenceTask, options) {
        // Chart or project are not editable (setup locked)
        if (this.readOnly || this.taskStore.rootNode.readOnly) {
          return;
        }
    
        // Schedule is not editable
        // if (!referenceTask.isContainingScheduleEditable) {
        //   return;
        // }
        // Task is not editable
        if (options?.asChild && referenceTask.get('isEditable') === false) {
          return;
        }
    
        const name = 'test';

        
    
        // @ts-ignore
        const task = await this._overridden.addTask.call(this, referenceTask, { ...options, data: { name, duration: 1 } });    
        // this.features.cellEdit.startEditing({
        //   record: task,
        //   field: 'name',
        // });
        //await sleep(500);
        // for (let i = 0; i < 1000000000; ++i) {

        // }
    
        return task;
      }
}

Override.apply(GanttOverride);
