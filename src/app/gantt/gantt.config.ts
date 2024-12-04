import { BryntumGanttProps } from '@bryntum/gantt-angular';
import '../lib/GanttToolbar.js';
import '../lib/StatusColumn.js';
import Task from '../lib/Task.js';
import { AjaxHelper, TaskModel } from '@bryntum/gantt'

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

    dependencyIdField : 'wbsCode',
    selectionMode     : {
        cell       : true,
        dragSelect : true,
        rowNumber  : true
    },
    project : {
        // *** start test
        addConstraintOnDateSet: false,
        autoSetConstraints: false,
        autoSync: true,
        autoSyncTimeout: 400,
        skipNonWorkingTimeWhenSchedulingManually: true,
        skipNonWorkingTimeInDurationWhenSchedulingManually: true,
        resetUndoRedoQueuesAfterLoad: true,

        listeners: {
            catchAll: (event) => {
                console.log('project.catchAll', event.eventName);
            },
            beforeSync: (params: {pack}) => {
                const pack = params.pack;
                console.log('listeners.beforeSync', pack);
                const added = pack.tasks?.added;
                const updated = pack.tasks?.updated;
                const removed = pack.tasks?.removed;
                console.log('CfGanttService.beforeSync', added, pack);
                if (added && added.length > 0) {
                    console.log('Added tasks: ', added.length);
                    added.forEach((task: {Name: string, PhantomId: string, __record__: { wbsCode: string} }) => {
                        console.log('Added task: ', (task.__record__.wbsCode + ' ' + task.Name), task.PhantomId);
                    });
                }

                // Create mock data
                requestId = pack.requestId;
                if (added?.length > 0) {
                    modifiedTasks = added;
                } else {
                    modifiedTasks = [];
                }
                if (updated?.length > 0) {
                    modifiedTasks.concat(updated);
                }
                if (removed?.length > 0) {
                    removedTasks = removed;
                } else {
                    removedTasks = [];
                }
            },
        },
        taskStore: {
            listeners: {
                add: (event) => {
                    const addedRecords = event.records;
                    if (addedRecords?.length > 0) {
                        addedRecords.forEach((record: TaskModel & { wbsCode: string, isValid: boolean }) => {
                            console.log('taskStore.add event', record.wbsCode + ' ' + record.get('Name'), record.get('Id'), record.isValid);
                        });
                    }
                },
                catchAll: (event: any) => {
                    console.log('taskStore.catchAll', event.eventName);
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
    },

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
            console.log('gantt.catchAll', event.eventName);
        }
    },
    // *** end test

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

// *** start test
AjaxHelper.mockUrl('./sync-changes', (props: any) => {
    return {
        success: true,
        requestId: requestId,
        responseText: JSON.stringify({
            success: true,
            requestId: 4711,
            dependencies: {
                rows: [],
                removed: []
            },
            tasks: {
                rows: modifiedTasks,
                removed : removedTasks,
            },
        }),
        delay: 1000
    };
});
// *** end test


export default ganttProps;
