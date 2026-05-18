using { celebrations } from '../db/schema';

@path: '/admin'
@requires: 'authenticated-user'
service AdminService {

  entity Employees as projection on celebrations.Employees;
  entity Wishes    as projection on celebrations.Wishes;

}
