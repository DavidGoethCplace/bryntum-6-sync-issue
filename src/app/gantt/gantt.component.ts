import { Component, OnInit } from '@angular/core';
import ganttProps from './gantt.config';

@Component({
    selector    : 'app-gantt',
    templateUrl : './gantt.component.html'
})
export class GanttComponent implements OnInit {
    ganttProps = ganttProps;

    ngOnInit() { }
}
