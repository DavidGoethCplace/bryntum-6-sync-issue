import { CellEdit, GridFeatureManager } from "@bryntum/gantt";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class CellEditOverride extends CellEdit  {
    static $name = 'CellEdit';

    async finishAndEditNextRow(event, previous = false) {
        await super.finishAndEditNextRow(event, previous);
        await sleep(500);
        return await super.finishAndEditNextRow(event, previous);
    }
}
GridFeatureManager.registerFeature(CellEditOverride, true, 'Gantt');