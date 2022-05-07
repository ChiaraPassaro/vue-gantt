export interface Task {
  //data
  id?: number;
  name?: string;
  bucket: number;
  groupCode: string;
  rank: any;
  startDate: string;
  endDate: string;
  days: number;
  offset: number;
  width: number;
  marginLeft: number;
}
