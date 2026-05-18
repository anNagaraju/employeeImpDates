const cds = require('@sap/cds')
const test = cds.test(__dirname + '/..')

let srv
let Employees, Wishes

beforeAll(async () => {
  srv = await cds.connect.to('PublicService')
  const db = await cds.connect.to('db')
  Employees = cds.entities('celebrations').Employees
  Wishes    = cds.entities('celebrations').Wishes
})

describe('TodayCelebrations', () => {
  it('should return employee with birthday today', async () => {
    const today = new Date()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const birthdayToday = `1990-${mm}-${dd}`

    const ID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID,
      name: 'Test Birthday Person',
      department: 'Test Dept',
      birthday: birthdayToday,
      hireDate: '2000-01-15'
    })

    const result = await srv.send('TodayCelebrations', {})
    const found = result.find(r => r.ID === ID && r.celebrationType === 'birthday')
    expect(found).toBeDefined()
    expect(found.name).toBe('Test Birthday Person')
  })

  it('should return employee with work anniversary today', async () => {
    const today = new Date()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const hireToday = `2020-${mm}-${dd}`

    const ID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID,
      name: 'Test Anniversary Person',
      department: 'Test Dept',
      birthday: '1990-03-15',
      hireDate: hireToday
    })

    const result = await srv.send('TodayCelebrations', {})
    const found = result.find(r => r.ID === ID && r.celebrationType === 'anniversary')
    expect(found).toBeDefined()
    expect(found.yearsCount).toBe(today.getFullYear() - 2020)
  })

  it('should not return employee whose birthday is not today', async () => {
    const ID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID,
      name: 'Test Future Person',
      department: 'Test Dept',
      birthday: '1990-01-01',
      hireDate: '2000-01-02'
    })

    const result = await srv.send('TodayCelebrations', {})
    const found = result.find(r => r.ID === ID)
    expect(found).toBeUndefined()
  })
})

describe('UpcomingCelebrations', () => {
  it('should return employee with birthday in next 7 days', async () => {
    const future = new Date()
    future.setDate(future.getDate() + 3)
    const mm = String(future.getMonth() + 1).padStart(2, '0')
    const dd = String(future.getDate()).padStart(2, '0')
    const birthdaySoon = `1988-${mm}-${dd}`

    const ID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID,
      name: 'Test Upcoming Birthday',
      department: 'Sales',
      birthday: birthdaySoon,
      hireDate: '2001-06-20'
    })

    const result = await srv.send('UpcomingCelebrations', {})
    const found = result.find(r => r.ID === ID && r.celebrationType === 'birthday')
    expect(found).toBeDefined()
    expect(found.daysUntil).toBe(3)
  })

  it('should not return employee with birthday today in UpcomingCelebrations', async () => {
    const today = new Date()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')

    const ID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID,
      name: 'Test Today Only',
      department: 'HR',
      birthday: `1985-${mm}-${dd}`,
      hireDate: '2005-09-01'
    })

    const result = await srv.send('UpcomingCelebrations', {})
    const found = result.find(r => r.ID === ID)
    expect(found).toBeUndefined()
  })

  it('results should be sorted by daysUntil ascending', async () => {
    const result = await srv.send('UpcomingCelebrations', {})
    for (let i = 1; i < result.length; i++) {
      expect(result[i].daysUntil).toBeGreaterThanOrEqual(result[i - 1].daysUntil)
    }
  })
})

describe('Wish Submission', () => {
  it('should save a wish for an employee', async () => {
    const empID = cds.utils.uuid()
    await INSERT.into(Employees).entries({
      ID: empID,
      name: 'Wish Test Employee',
      department: 'Engineering',
      birthday: '1990-06-15',
      hireDate: '2018-01-10'
    })

    const wishID = cds.utils.uuid()
    await INSERT.into(Wishes).entries({
      ID: wishID,
      employee_ID: empID,
      senderName: 'Test Sender',
      message: 'Happy celebrations!',
      celebrationType: 'birthday'
    })

    const saved = await SELECT.from(Wishes).where({ employee_ID: empID, celebrationType: 'birthday' })
    expect(saved.length).toBeGreaterThan(0)
    expect(saved[0].message).toBe('Happy celebrations!')
  })
})
