export type HourEntry = {
  id: number;
  hours: number;
  date: string;
  type: { id: number; name: string };
  location: { id: number; name: string };
};