namespace celebrations;

using { cuid, managed } from '@sap/cds/common';

entity Employees : cuid, managed {
  name        : String(100) not null;
  email       : String(150);
  department  : String(100);
  birthday    : Date;          // Month/Day used for yearly recurrence
  hireDate    : Date;          // Used to compute work anniversary
  photoUrl    : String(500);   // Optional profile photo URL
  githubUrl   : String(500);   // Optional GitHub profile URL
  wishes      : Composition of many Wishes on wishes.employee = $self;
}

entity Wishes : cuid, managed {
  employee        : Association to Employees not null;
  senderName      : String(100);
  message         : String(500);
  celebrationType : String(20);  // 'birthday' or 'anniversary'
}
