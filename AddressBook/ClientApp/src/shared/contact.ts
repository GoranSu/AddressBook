import { PhoneNumber } from "./phone-number";

export class Contact {
  Id: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  DateOfBirth: Date;
  Address: string;
  PhoneNumbers: PhoneNumber[];
}
