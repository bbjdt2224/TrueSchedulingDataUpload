import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Class } from './class';
import * as firebase from 'firebase';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ClassesService {

    constructor(private http: HttpClient) { }

    addSchedule(c: Class[], semester, year) {
        c.forEach(cls => {
            console.log(cls);
            firebase.database().ref('classes/' + year + '/' + semester + '/' + cls.crn).set(cls);
        });
    }

    addFinals(days, times, semester, year) {
        const labels = ['m8', 'm9', 'm10', 'm11', 'm12', 'm1', 'm2', 'm3', 'm4', 'm5',
        't8', 't9', 't10', 't11', 't12', 't1', 't2', 't3', 't4', 't5',
        'w4', 'w5',
        'r4', 'r5'];
        for (let i = 0; i < days.length; i ++) {
            const day = { day: days[i], time: times[i]};
            firebase.database().ref('finals/' + year + '/' + semester + '/' + labels[i]).set(day);
        }
    }
}
