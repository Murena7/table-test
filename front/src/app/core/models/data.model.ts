import { Subscription } from 'rxjs';

export interface IDataTreeParrent {
  values: IDataTree[];
  sub: Subscription;
}

export interface IDataTree {
  name: string;
  leads: number;
  revenueCalls: number;
  revenueLeads: number;
  child: IDataTree[];
  sub: Subscription;
  isOpen: boolean;
}

export class DataTree {
  name: string;
  leads: number;
  revenueCalls: number;
  revenueLeads: number;
  child: IDataTree[] = [] as IDataTree[];
  sub: Subscription = null;
  isOpen: false;
}

export class DataTreeParrent {
  values: IDataTree[] = [];
  sub: Subscription = null;
}
