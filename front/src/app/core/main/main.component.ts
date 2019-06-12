import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IDataTree, DataTree, IDataTreeParrent, DataTreeParrent } from '../models/data.model';
import { Observable, timer, ReplaySubject } from 'rxjs';
import { shareReplay, switchMap, delay, takeUntil } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

const SELECTORS = ['campaigns', 'buyers', 'daily', 'hourly'];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  data: IDataTreeParrent = {} as IDataTreeParrent;
  timer: Observable<any>;
  togglerValue = 'campaigns';
  valueSelectorLevel2 = '';
  sortParameters: Sort;

  selectorLevel2 = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.data = new DataTreeParrent();
    this.timer = timer(0, 15000).pipe(shareReplay({ bufferSize: 1, refCount: true }), takeUntil(this.destroy));
    this.data.sub = this.timer.pipe(switchMap(() => {
      return this.apiService.requestApi('campaigns').pipe(delay(2000), takeUntil(this.destroy));
    })).subscribe(x => {
      this.setDataToTree(x, this.data.values);
    });
    this.selectorValueWatcher(this.togglerValue);
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private setDataToTree(newData: IDataTree[], oldData: IDataTree[]) {
    newData.forEach((value: IDataTree, index) => {
      if (!oldData[index]) { oldData[index] = new DataTree(); }
      oldData[index] = { ...oldData[index], ...value };
    });
    this.sortData(this.sortParameters);
  }

  onSelectorL2CHange(event) {
    this.valueSelectorLevel2 = event.value;
    this.preparationOnSelectorChange();
  }

  private selectorValueWatcher(value) {
    this.selectorLevel2 = SELECTORS.filter(x => {
      return x !== value;
    });
  }

  onTogglerChange(event) {
    this.selectorValueWatcher(event.value);
    this.massChildUnsubscriberAndClean(this.data.values);
    this.preparationOnTogglerChange(event);
    this.data.sub = this.timer.pipe(switchMap(() => {
      return this.apiService.requestApi(this.togglerValue).pipe(delay(2000), takeUntil(this.destroy));
    })).subscribe(x => {
      this.setDataToTree(x, this.data.values);
    });
  }

  private preparationOnTogglerChange(event) {
    this.togglerValue = event.value;
    this.data.values = [];
    this.data.sub.unsubscribe();
  }

  private preparationOnSelectorChange() {
    this.massChildUnsubscriberAndClean(this.data.values);
  }

  openChildLevel(index: number, value: string, level: number) {
    if (this.valueSelectorLevel2 === '') { return; }
    switch (level) {
      case 2:
        if (this.data.values[index] && this.data.values[index].isOpen) {
          this.closeToggle(this.data.values[index]);
        } else {
          this.openToggle(this.data.values[index], value);
        }
        break;
      case 3:

        break;
      default:
        console.warn('Wrong Level');
        break;
    }
  }

  private closeToggle(data: IDataTree) {
    data.sub.unsubscribe();
    data.isOpen = false;
    data = {} as IDataTree;
    this.massChildUnsubscriberAndClean(data.child);
  }

  private openToggle(data: IDataTree, value: string) {
    data.isOpen = true;
    data.sub = this.timer.pipe(switchMap(() => {
      return this.apiService.requestApi(this.valueSelectorLevel2).pipe(delay(2000), takeUntil(this.destroy));
    })).subscribe(x => {
      this.setDataToTree(x, data.child);
    });
  }

  private massChildUnsubscriberAndClean(data: Array<IDataTree>) {
    (data || []).forEach((element: IDataTree) => {
      if (element.sub) { element.sub.unsubscribe(); }
      element.isOpen = false;
      element.child = [];
      if (element.child && element.child.length > 0) {
        this.massChildUnsubscriberAndClean(element.child);
      }
    });
  }

  sortData(sort: Sort) {

    if (!sort || !sort.active || sort.direction === '') {
      return;
    }
    this.sortParameters = sort;

    this.data.values = this.data.values.sort((a, b) => {
      return this.sortHelper(sort, a, b);
    });

    this.data.values.forEach((value, index) => {
      if (value.child && value.child.length > 0) {
        this.massChildSort(value.child, sort);
      }
    });
  }

  private massChildSort(child: IDataTree[], sort) {
    child = child.sort((a, b) => {
      return this.sortHelper(sort, a, b);
    });
  }

  private sortHelper(sort, a, b): number {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'name': return this.compare(a.name, b.name, isAsc);
      case 'leads': return this.compare(a.leads, b.leads, isAsc);
      default: return 0;
    }
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
