import { BryntumGanttProps } from '@bryntum/gantt-angular';
import '../lib/CellEditOverride.js';
import '../lib/GanttToolbar.js';
import '../lib/StatusColumn.js';
import Task from '../lib/Task.js';
import Project from '../lib/Project.js';
import { AjaxHelper } from '@bryntum/gantt'

const project = new Project({
    // *** start test
    addConstraintOnDateSet: false,
    autoSetConstraints: false,
    autoSync: true,
    autoSyncTimeout: 400,
    skipNonWorkingTimeWhenSchedulingManually: true,
    skipNonWorkingTimeInDurationWhenSchedulingManually: true,
    resetUndoRedoQueuesAfterLoad: true,

    taskStore: {
        listeners: {
            add: () => {
                // keep busy for a while to trigger the sync bug
                for (let i = 0; i < 1000000000; ++i) {}
            },
        }
    },

    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass     : Task,
    transport          : {
        load : {
            url : 'assets/data/launch-saas.json'
        },
        sync : {
            url : './sync-changes'
        }
    },
    autoLoad : true,

    stm : {
        autoRecord : true
    },
    validateResponse : true
},);

const ganttProps : BryntumGanttProps = {
    showDirty: true,
    scrollTaskIntoViewOnCellClick: true,

    cellEditFeature: {
        addToCurrentParent: true,
    },

    dependencyIdField : 'wbsCode',
    selectionMode     : {
        cell       : true,
        dragSelect : true,
        rowNumber  : true
    },

    project: project,

    startDate               : '2019-01-12',
    endDate                 : '2019-03-24',
    resourceImageFolderPath : 'assets/users/',
    columns                 : [
        { type : 'wbs', hidden : true },
        { type : 'name', width : 250, showWbs : true },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'calendar' },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'earlystartdate' },
        { type : 'earlyenddate' },
        { type : 'latestartdate' },
        { type : 'lateenddate' },
        { type : 'addnew' }
    ],

    subGridConfigs : {
        locked : {
            flex : 3
        },
        normal : {
            flex : 4
        }
    },

    columnLines : false,

    rollupsFeature : {
        disabled : true
    },

    baselinesFeature : {
        disabled : true
    },

    progressLineFeature : {
        disabled   : true,
        statusDate : new Date(2019, 0, 25)
    },

    filterFeature : true,

    dependencyEditFeature : true,

    labelsFeature : {
        left : {
            field  : 'name',
            editor : {
                type : 'textfield'
            }
        }
    },

    tbar : {
        // @ts-ignore This is an application custom widget
        type : 'gantttoolbar'
    }
};

function randomInt(): number {
    return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));
}

AjaxHelper.mockUrl('./sync-changes', (url: any, params: any, options: any) => {
    const body = JSON.parse(options.body);
    const tasks = {
        rows: (body.tasks.added as any[]) ?? [],
        removed : body.tasks.removed ?? [],
    };

    tasks.rows = tasks.rows.map((entry) => (
         {
            ...entry,
            id: randomInt(),
        }
    ));

    return {
        success: true,
        requestId: body.requestId,
        responseText: JSON.stringify({
            success: true,
            requestId: body.requestId,
            dependencies: {
                rows: [],
                removed: []
            },
            tasks: tasks,
        }),
        delay: 400
    };
});

export default ganttProps;
