import { Component } from '@angular/core';
import { Class } from './class';
import { ClassesService } from './classes.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyDZWp0LGYUcjX5nogkWPGwrCCyxpBJZJXw',
    authDomain: 'truescheduling-847d8.firebaseapp.com',
    databaseURL: 'https://truescheduling-847d8.firebaseio.com',
    projectId: 'truescheduling-847d8',
    storageBucket: 'truescheduling-847d8.appspot.com',
    messagingSenderId: '536371574906'
   };

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    classes: Class[] = new Array();
    semester = '';
    year = 0;

    labels = ['All Monday 8 a.m. classes', 'All Monday 9 a.m. classes', 'All Monday 10 a.m. classes', 'All Monday 11 a.m. classes',
    'All Monday 12 p.m. classes', 'All Monday 1 p.m. classes', 'All Monday 2 p.m. classes', 'All Monday 3 p.m. classes',
    'All Monday 4:00-5:29 p.m. classes', 'All Monday 5:30 p.m. & after',
    'All Tuesday 8 a.m. classes', 'All Tuesday 9 a.m. classes', 'All Tuesday 10 a.m. classes', 'All Tuesday 11 a.m. classes',
    'All Tuesday 12 p.m. classes', 'All Tuesday 1 p.m. classes', 'All Tuesday 2 p.m. classes', 'All Tuesday 3 p.m. classes',
    'All Tuesday 4:00-5:29 p.m. classes', 'All Tuesday 5:30 p.m. & after',
    'All Wednesday 4:00-5:29 p.m. classes', 'All Wednesday 5:30 p.m. & after',
    'All Thursday 4:00-5:29 p.m. classes', 'All Thursday 5:30 p.m. & after'];
    examDays = [{ id: 'm', value: 'Monday'}, { id: 't', value: 'Tuesday'}, { id: 'w', value: 'Wednesday'}, { id: 'r', value: 'Thursday'}];
    examTimes = [{ id: 1, value: '8 a.m. to 10 a.m.'}, { id: 2, value: '10:15 a.m. to 12:15 p.m.'},
    { id: 3, value: '12:30 p.m. to 2:30 p.m.'}, { id: 4, value: '2:45 p.m. to 4:45 p.m.'},
    { id: 5, value: '5 p.m. to 7 p.m.'}, { id: 6, value: '7:15 p.m. to 9:15 p.m.'}];
    selectedDays = [];
    selectedTimes = [];

    constructor(private classesService: ClassesService) {
        firebase.initializeApp(config);
    }

    readFile(files: FileList) {
        console.log(files);
        const cls: string[] = new Array();
        const file: File = files.item(0);
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const csv: string = reader.result;
            const lines = csv.split('\n');
            for (let i = 3; i < (lines.length - 3); i ++) {
                const c = lines[i].split(',');
                const tempClass = new Class();
                this.semester = c[0].substring(0, c[0].length - 5);
                this.year = parseInt(c[0].substring(c[0].length - 4, c[0].length), 10);
                tempClass.course = c[4];
                tempClass.crn = parseInt(c[5], 10);
                tempClass.title = c[7];
                tempClass.days = c[16];
                tempClass.time = c[17];
                tempClass.building = c[18];
                tempClass.room = c[19];
                tempClass.instructor = c[20];
                tempClass.instemail = c[24];
                this.classes.push(tempClass);
                cls.push(JSON.stringify(tempClass));
            }
            this.classesService.addSchedule(this.classes, this.semester, this.year);
        };
    }

    submitFinals() {
        this.classesService.addFinals(this.selectedDays, this.selectedTimes, this.semester, this.year);
    }

}
