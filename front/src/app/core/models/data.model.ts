import { Subscription } from 'rxjs';

export interface IDataTree {
  values: IDataTreeValue[];
  sub: Subscription;
  child: IDataTree;
  childIndex: number;
}

export interface IDataTreeValue {
  name: string;
  leads: number;
  revenueCalls: number;
  revenueLeads: number;
}

export class DataTree {
  values: IDataTreeValue[] = [] as IDataTreeValue[];
  sub: Subscription = null;
  child: IDataTree = {} as IDataTree;
  childIndex: number = null;
}
