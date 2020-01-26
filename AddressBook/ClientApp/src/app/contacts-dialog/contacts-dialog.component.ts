import { Component, OnInit, Inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Contact } from '../../shared/contact';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddressBookService } from '../../shared/addressbook.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contacts-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.css']
})
export class ContactsDialogComponent implements OnInit {
  title: string;
  contactForm: FormGroup;
  contact: Contact;
  action: string;
  dataReceived: boolean;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  @Output() formContent: EventEmitter<Contact> = new EventEmitter<Contact>();


  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ContactsDialogComponent>,
    private formBuilder: FormBuilder,
    private service: AddressBookService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data) {
    console.log(data)
    this.action = data.action;
    this.createForm();

    switch (data.action) {
      case 'view': {
        //statements;
        this.title = 'View contact';
        this.getData(data.contactId);
        break;
      }
      case 'edit': {
        //statements;
        this.title = 'Edit contact';
        this.getData(data.contactId);
        break;
      }
      default: {
        //statements;
        console.log('create should be default.');
        this.title = 'Create contact';
        this.dataReceived = true;
        this.contact = new Contact();
        this.initiateForm(new Contact());
        break;
      }
    }
  }

  ngOnInit() {
  }

  getData(contactId: number) {
    this.service.getContact(contactId).subscribe(
      data => {
        this.contact = data;
        this.initiateForm(this.contact);
        this.dataReceived = true;
      },
      err => console.log(err),
      () => console.log('yay')
    );
  }

  createForm() {
    this.contactForm = this.formBuilder.group({
      Id: [null],
      FirstName: [''],
      LastName: [''],
      DateOfBirth: [''],
      Address: ['']
    });
  }

  initiateForm(contact: Contact) {
    this.contactForm = this.formBuilder.group({
      Id: [contact.Id ? contact.Id : null],
      FirstName: [contact.FirstName ? contact.FirstName : ''],
      LastName: [contact.LastName ? contact.LastName : ''],
      DateOfBirth: [contact.DateOfBirth ? contact.DateOfBirth : ''],
      Address: [contact.Address ? contact.Address : ''],

      // Nested array
      PhoneNumbers: this.formBuilder.array([]),
    });

    if (contact.PhoneNumbers) {
      this.setPhoneNumbers(contact);
    }

    if (this.action === 'view') {
      this.contactForm.disable();

    }
  }

  setPhoneNumbers(contact: Contact) {
    const control = <FormArray>this.contactForm.get('PhoneNumbers');
    contact.PhoneNumbers.forEach(x => {
      control.push(
        this.formBuilder.group({
          Id: [x.Id ? x.Id : null],
          ContactId: [x.ContactId ? x.ContactId : null],
          Number: [x.Number ? x.Number : '', Validators.required],
        })
      );
    });
  }

  getPhones(contactForm) {
    return contactForm['controls'].PhoneNumbers['controls'];
  }

  addNewPhone() {
    const phonesFormArray = <FormArray>this.contactForm.controls.PhoneNumbers;
    phonesFormArray.push(
      this.formBuilder.group({
        Number: ['', Validators.required]
      })
    );
  }

  deletePhonePrompt(control, index) {
    // Opens the dialog component, and disables escape button
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    // Send a custom message to component
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this phone?';

    // On dialog closing, get result and do some logic
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If there is a result, call the delete method with params
        this.deletePhone(control, index);
      }
      this.confirmDialogRef = null;
    });
  }

  deletePhone(telephoneFormArray, index) {
    telephoneFormArray.removeAt(index);
  }

  edit() {
    this.dialogRef.close('edit')
  }
  save() {
    if (this.contactForm.valid && this.contactForm.dirty) {
      this.formContent.emit(this.contactForm.value);
      this.dialogRef.close('save');
    } else {
      console.log('no changes sent to server')
    }
  }
  delete() {
    this.formContent.emit(this.contactForm.value);
    this.dialogRef.close('delete');
  }
}
