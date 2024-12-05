import { CellEdit, GridFeatureManager } from "@bryntum/gantt";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class CellEditOverride extends CellEdit  {
    static $name = 'CellEdit';

    async finishAndEditNextRow(event, previous = false) {
        console.log("finishAndEditNextRow");
        event.try = 'first';
        const result1 = await super.finishAndEditNextRow(event, previous);
        await sleep(500);
        
        event.try = 'second';
        //console.log('hello!', event.widget.project);
        
        const result = await super.finishAndEditNextRow(event, previous);
        await sleep(500);
        //await sleep(5000);
        const project = event.widget.project;
        // setTimeout(() => {
        //     //project.resumeAutoSync?.(false);
        //     //project.sync();
        // }, 5000);

        console.log(result1, result);
        //
        return result;
        //await sleep(500);
        //return super.finishAndEditNextRow.call(this, event, previous);
    }
}
GridFeatureManager.registerFeature(CellEditOverride, true, 'Gantt');