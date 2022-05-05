export interface Task {
  //data
  id?: string;
  name?: string;
  bucket: number;
  groupCode: string;
  rank: any;
  startDate: string;
  endDate: string;
  days: number;
  offset: number;
}
