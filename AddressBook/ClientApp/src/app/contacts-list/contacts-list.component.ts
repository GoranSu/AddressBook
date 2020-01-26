import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressBookService } from '../../shared/addressbook.service';
import { Contact } from '../../shared/contact';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ContactsDialogComponent } from '../contacts-dialog/contacts-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  dataReceived: boolean = false;
  displayedColumns: string[] = ['select', 'FirstName', 'LastName', 'FullName', 'Address', 'DateOfBirth', 'buttons'];
  contacts: Contact[];
  data: any;
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource<Contact>(this.data);
  selection = new SelectionModel<Contact>(true, []);
  dialogRef: any;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  filterValue: string = '';
  constructor(private service: AddressBookService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getContactData();
  }

  getContactData() {
    this.service.getContacts().subscribe((response: Contact[]) => {
      this.contacts = response;
      this.data = Object.assign(this.contacts)
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataReceived = true;
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      this.removeItem(item);
    });
    this.selection = new SelectionModel<Contact>(true, []);
  }

  removeItem(contact: Contact) {
    this.delete(contact.Id);
  }

  openDialog(action, row) {
    console.log(action, row)
    this.dialogRef = this.dialog.open(ContactsDialogComponent, {
      width: '400px',
      data: {
        action: action,
        contactId: row !== null ? row.Id : null
      }
    });

    var formValue: Contact;
    this.dialogRef.componentInstance.formContent.subscribe((emittedValue: Contact) => {
      formValue = emittedValue;
    });

    this.dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        } else if (result === 'edit') {
          this.openDialog('edit', row);
        } else if (result === 'delete') {
          console.log('delete')
          this.deletePrompt(formValue);
        } else if (result === 'save') {
          if (formValue.Id !== null) {
            this.service.putContact(formValue.Id, formValue).subscribe(res => { this.getContactData(); })
          } else {
            this.service.postContact(formValue).subscribe(response => this.getContactData());
          }
        }
      });
  }

  deletePrompt(row) {
    // Opens the dialog component, and disables escape button
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    // Send a custom message to component
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this contact?';

    // On dialog closing, get result and do some logic
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If there is a result, call the delete method with params
        this.delete(row.Id);
      }
      this.confirmDialogRef = null;
    });
  }

  delete(id: number) {
    this.service.deleteContact(id).subscribe(response => { this.getContactData(); });
  }
}
