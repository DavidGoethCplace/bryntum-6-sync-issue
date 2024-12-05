import { BryntumGanttProps } from '@bryntum/gantt-angular';
import '../lib/CellEditOverride.js';
import '../lib/GanttToolbar.js';
import '../lib/StatusColumn.js';
import '../lib/GanttOverride.js';
import Task from '../lib/Task.js';
import Project from '../lib/Project.js';
import { AjaxHelper, TaskModel } from '@bryntum/gantt'

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Random string of 9 characters
  }

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
            add: (event) => {
                const addedRecords = event.records;
                if (addedRecords?.length > 0) {
                    addedRecords.forEach((record: TaskModel & { wbsCode: string, isValid: boolean }) => {
                        record.set('name', generateRandomId());
                        //console.log('taskStore.add event', record.wbsCode + ' ' + record.get('Name'), record.get('Id'), record.isValid);
                    });
                for (let i = 0; i < 1000000000; ++i) {

                }    
                }
            },
            catchAll: (event: any) => {
                //console.log('taskStore.catchAll', event.eventName);
            }
        }
    },
    // *** end test

    // autoSetConstraints : true,
    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass     : Task,
    transport          : {
        load : {
            url : 'assets/data/launch-saas.json'
        },

        // *** start test
        sync : {
            url : './sync-changes'
        }
        // *** end test
    },
    autoLoad : true,

    // The State TrackingManager, which the UndoRedo widget in the toolbar uses
    stm : {
        // NOTE, that this option does not enable the STM itself, this is done by the `undoredo` widget, defined in the toolbar
        // If you don't use `undoredo` widget in your app, you need to enable STM manually: `stm.enable()`,
        // otherwise, it won't be tracking changes in the data
        // It's usually best to enable STM after the initial data loading is completed.
        autoRecord : true
    },

    // This config enables response validation and dumping of found errors to the browser console.
    // It's meant to be used as a development stage helper only, so please set it to false for production systems.
    validateResponse : true
},);

// *** start test
let modifiedTasks = [];
let removedTasks = [];
let requestId = null;
// *** end test

const ganttProps : BryntumGanttProps = {
    // *** start test
    showDirty: true,
    scrollTaskIntoViewOnCellClick: true,

    cellEditFeature: {
        addToCurrentParent: true,
    },
    // rowReorder: {
    //     gripOnly: true,
    //     showGrip: true,
    //     // Preserve sorters after a drop operation, if that operation leads to the store still being sorted.
    //     preserveSorters: true,
    // },
    // fillHandle: true,
    // *** end test

    dependencies: {
        //@ts-ignore
        drawOnScroll: false,
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

        /*
                { type : 'wbs', hidden : true },
                { type : 'name', width : 250, showWbs : true },
                { type : 'startdate' },
                { type : 'duration' },
                { type : 'resourceassignment', width : 120, showAvatars : true },
                { type : 'percentdone', mode : 'circle', width : 70 },
                {
                    type  : 'predecessor',
                    width : 112
                },
                {
                    type  : 'successor',
                    width : 112
                },
                { type : 'schedulingmodecolumn' },
                { type : 'calendar' },
                { type : 'constrainttype' },
                { type : 'constraintdate' },
                // @ts-ignore This is an application custom column
                { type : 'statuscolumn' },
                {
                    type  : 'date',
                    text  : 'Deadline',
                    field : 'deadline'
                },
                { type : 'addnew' }
        */
    ],

    // *** start test
    listeners: {
        catchAll: (event) => {
            //console.log('gantt.catchAll', event.eventName);
        }
    },
    // *** end test

    subGridConfigs : {
        fixed : {
            flex : 3
        },
        locked : {
            flex : 3
        },
        normal : {
            flex : 4
        }
    },

    columnLines : false,

    rowReorderFeature: {
        gripOnly: true,
        showGrip: true,
        // Preserve sorters after a drop operation, if that operation leads to the store still being sorted.
        preserveSorters: true,
      },

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

    timeRangesFeature : {
        showCurrentTimeLine : true
    },

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

// *** start test
AjaxHelper.mockUrl('./sync-changes', (url: any, params: any, options: any) => {
    const body = JSON.parse(options.body);
    const tasks = {
        rows: (body.tasks.added as any[]) ?? [],
        removed : body.tasks.removed ?? [],
        //updated: body.tasks.updated ?? [],
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
// *** end test


export default ganttProps;
