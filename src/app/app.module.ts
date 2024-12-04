import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { GanttComponent } from './gantt/gantt.component';
import { BryntumGanttModule } from '@bryntum/gantt-angular';

@NgModule({
    declarations : [
        AppComponent,
        GanttComponent
    ],
    imports : [
        BrowserModule,
        BryntumGanttModule
    ],
    providers : [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap : [AppComponent]
})
export class AppModule { }
