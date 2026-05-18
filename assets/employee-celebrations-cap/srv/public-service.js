const cds = require('@sap/cds')

module.exports = class PublicService extends cds.ApplicationService {

  async init() {

    const { Employees, Wishes } = cds.entities('celebrations')

    /**
     * Returns employees celebrating a birthday or work anniversary today.
     */
    this.on('TodayCelebrations', async () => {
      const today = new Date()
      const month = today.getMonth() + 1  // 1-12
      const day   = today.getDate()       // 1-31

      const employees = await SELECT.from(Employees).columns(
        'ID', 'name', 'department', 'photoUrl', 'birthday', 'hireDate'
      )

      const results = []

      for (const emp of employees) {
        const checks = []

        if (emp.birthday) {
          const [, bMon, bDay] = emp.birthday.split('-').map(Number)
          const effectiveDay = _effectiveDay(bMon, bDay, today.getFullYear())
          if (effectiveDay.month === month && effectiveDay.day === day) {
            checks.push({ celebrationType: 'birthday', yearsCount: null })
          }
        }

        if (emp.hireDate) {
          const [hYear, hMon, hDay] = emp.hireDate.split('-').map(Number)
          const effectiveDay = _effectiveDay(hMon, hDay, today.getFullYear())
          if (effectiveDay.month === month && effectiveDay.day === day) {
            const years = today.getFullYear() - hYear
            if (years > 0) {
              checks.push({ celebrationType: 'anniversary', yearsCount: years })
            }
          }
        }

        for (const check of checks) {
          const wishCountResult = await SELECT.one
            .from(Wishes)
            .columns('count(*) as cnt')
            .where({ employee_ID: emp.ID, celebrationType: check.celebrationType })
          const wishCount = wishCountResult ? parseInt(wishCountResult.cnt) || 0 : 0

          results.push({
            ID:              emp.ID,
            name:            emp.name,
            department:      emp.department,
            photoUrl:        emp.photoUrl,
            celebrationType: check.celebrationType,
            yearsCount:      check.yearsCount,
            wishCount
          })
        }
      }

      return results
    })

    /**
     * Returns employees with celebrations in the next 7 days (excluding today).
     */
    this.on('UpcomingCelebrations', async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const employees = await SELECT.from(Employees).columns(
        'ID', 'name', 'department', 'photoUrl', 'birthday', 'hireDate'
      )

      const results = []

      for (const emp of employees) {
        const checks = []

        if (emp.birthday) {
          const [, bMon, bDay] = emp.birthday.split('-').map(Number)
          const upcoming = _nextOccurrence(bMon, bDay, today)
          if (upcoming.daysUntil > 0 && upcoming.daysUntil <= 7) {
            checks.push({ celebrationType: 'birthday', yearsCount: null, ...upcoming })
          }
        }

        if (emp.hireDate) {
          const [hYear, hMon, hDay] = emp.hireDate.split('-').map(Number)
          const upcoming = _nextOccurrence(hMon, hDay, today)
          if (upcoming.daysUntil > 0 && upcoming.daysUntil <= 7) {
            const years = upcoming.celebrationYear - hYear
            if (years > 0) {
              checks.push({ celebrationType: 'anniversary', yearsCount: years, ...upcoming })
            }
          }
        }

        for (const check of checks) {
          const wishCountResult = await SELECT.one
            .from(Wishes)
            .columns('count(*) as cnt')
            .where({ employee_ID: emp.ID, celebrationType: check.celebrationType })
          const wishCount = wishCountResult ? parseInt(wishCountResult.cnt) || 0 : 0

          results.push({
            ID:              emp.ID,
            name:            emp.name,
            department:      emp.department,
            photoUrl:        emp.photoUrl,
            celebrationType: check.celebrationType,
            yearsCount:      check.yearsCount,
            daysUntil:       check.daysUntil,
            celebrationDate: check.celebrationDate,
            wishCount
          })
        }
      }

      // Sort by daysUntil ascending
      results.sort((a, b) => a.daysUntil - b.daysUntil)
      return results
    })

    return super.init()
  }
}

/**
 * Handle Feb 29 birthdays in non-leap years → treat as Mar 1.
 */
function _effectiveDay(month, day, year) {
  if (month === 2 && day === 29 && !_isLeapYear(year)) {
    return { month: 3, day: 1 }
  }
  return { month, day }
}

/**
 * Returns the next occurrence date (this year or next) and daysUntil.
 */
function _nextOccurrence(month, day, fromDate) {
  const year = fromDate.getFullYear()
  let effectiveDay = _effectiveDay(month, day, year)
  let candidate = new Date(year, effectiveDay.month - 1, effectiveDay.day)

  if (candidate <= fromDate) {
    // Already passed this year — try next year
    effectiveDay = _effectiveDay(month, day, year + 1)
    candidate = new Date(year + 1, effectiveDay.month - 1, effectiveDay.day)
  }

  const msPerDay = 24 * 60 * 60 * 1000
  const daysUntil = Math.round((candidate - fromDate) / msPerDay)
  const celebrationDate = candidate.toISOString().split('T')[0]
  const celebrationYear = candidate.getFullYear()

  return { daysUntil, celebrationDate, celebrationYear }
}

function _isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
