import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './contact';

const headers: HttpHeaders = new HttpHeaders()
  .set('Content-Type', 'application/json');

@Injectable()
export class AddressBookService {

  // WebAPI
  private contactsApi = 'https://localhost:44311/api/contacts/';
  private postavkeRadnogVremenaAPI = 'https://localhost:44343/api/postavkeRadnogVremena/';
  private zahvatAPI = 'https://localhost:44343/api/zahvati/';
  private intervaliAPI = 'https://localhost:44343/api/intervali/';
  private ugovoreniZahvatiAPI = 'https://localhost:44343/api/ugovoreniZahvati/';

  constructor(private http: HttpClient) {
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsApi);
  }
  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(this.contactsApi + id);
  }

  postContact(contact: Contact) {
    const contactForAPI = {
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      DateOfBirth: contact.DateOfBirth,
      Address: contact.Address,
      PhoneNumbers: contact.PhoneNumbers
    };
    const body = JSON.stringify(contactForAPI);
    console.log(body);
    return this.http.post<Contact>(this.contactsApi, body, { headers });
  }

  putContact(id: number, contact: Contact) {
    const body = JSON.stringify(contact);
    console.log(body);
    return this.http.put<Contact>(this.contactsApi + id, body, { headers });
  }

  deleteContact(id: number) {
    return this.http.delete<Contact>(this.contactsApi + id);
  }
}
