using { celebrations } from '../db/schema';

@path: '/public'
service PublicService {

  @readonly
  entity Employees as projection on celebrations.Employees {
    ID, name, department, photoUrl, birthday, hireDate
  };

  entity Wishes as projection on celebrations.Wishes;

  // Returns employees with birthday or work anniversary today
  function TodayCelebrations() returns array of {
    ID           : UUID;
    name         : String;
    department   : String;
    photoUrl     : String;
    celebrationType : String;
    yearsCount   : Integer;
    wishCount    : Integer;
  };

  // Returns employees with celebrations in next 7 days
  function UpcomingCelebrations() returns array of {
    ID              : UUID;
    name            : String;
    department      : String;
    photoUrl        : String;
    celebrationType : String;
    yearsCount      : Integer;
    daysUntil       : Integer;
    celebrationDate : String;
    wishCount       : Integer;
  };

}
