import { Gantt, Override } from '@bryntum/gantt';

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
    
        // Task is not editable
        if (options?.asChild && referenceTask.get('isEditable') === false) {
          return;
        }

        const task = await this._overridden.addTask.call(this, referenceTask, options);    
        // this.features.cellEdit.startEditing({
        //   record: task,
        //   field: 'name',
        // });
    
        return task;
      }
}

Override.apply(GanttOverride);
