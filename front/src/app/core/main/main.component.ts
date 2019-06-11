import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IDataTree } from '../models/data.model';
import { Observable, timer } from 'rxjs';
import { shareReplay, switchMap, delay } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  data: IDataTree = {} as IDataTree;
  timer: Observable<any>;
  togglerValue = 'campaigns';
  openToggler = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.timer = timer(0, 15000).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.data.sub = this.timer.pipe(switchMap(() => {
      return this.apiService.requestApi('campaigns').pipe(delay(2000));
    })).subscribe(x => {
      this.data.values = x;
    });
  }

  ngOnDestroy() {
  }

  onTogglerChange(event) {
    this.data.values = [];
    this.openToggler = false;
    this.togglerValue = event.value;
    this.data.sub.unsubscribe();
    if (this.data.child && this.data.child.sub) { this.data.child.sub.unsubscribe(); }
    this.data.child = null;
    this.data.childIndex = null;
    this.data.sub = this.timer.pipe(switchMap(() => {
      return this.apiService.requestApi(this.togglerValue).pipe(delay(2000));
    })).subscribe(x => {
      this.data.values = x;
    });
  }

  openChildLevel2(index, value) {
    if (this.togglerValue === 'daily' || this.togglerValue === 'hourly') {
      return;
    }

    if (this.closeToggle()) {
      this.openToggle(index);
      this.data.child.values = null;
      this.data.child.sub = this.timer.pipe(switchMap(() => {
        return this.apiService.requestApi(this.togglerValue, { name: value, filter: 'hourly' }).pipe(delay(2000));
      })).subscribe(x => {
        this.data.child.values = x;
      });
    }
  }

  private closeToggle(): boolean {
    if (this.openToggler && this.data.childIndex !== undefined) {
      this.data.child.sub.unsubscribe();
      this.data.childIndex = null;
      this.data.child.values = [];
      this.openToggler = !this.openToggler;
      return false;
    } else {
      return true;
    }
  }

  private openToggle(index) {
    this.openToggler = !this.openToggler;
    this.data.childIndex = index;
    this.data.child ? this.data.child.sub.unsubscribe() : this.data.child = {} as IDataTree;
  }

  sortData(sort: Sort) {
    this.closeToggle();

    if (!sort.active || sort.direction === '') {
      return;
    }

    this.data.values = this.data.values.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'leads': return this.compare(a.leads, b.leads, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
