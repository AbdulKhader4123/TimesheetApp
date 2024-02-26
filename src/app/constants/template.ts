export const calendarData = {
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
    monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
    weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
}

export interface Day {
    date: string;
    day: string;
    type: string;
    normal_worked_hours: number;
    overtime?: number;
    sick?: number;
    planned_leave?: number;
    total_hours: number;
}

export interface Template {
    month: string;
    year: string;
    days: Day[];
    name: number;
}

export const templateMessage = {
   templateCreateSuccess: "Template created successfully.",
   templateCreateError: "Failed to create Template.",
   templatesFetchError: "Failed to load Templates.",
   templateFetchError: "Failed to load Template.",
}

export const timesheetMessage = {
    timesheetCreateSuccess: "Timesheet created successfully.",
    timesheetUpdateSuccess: "Timesheet updated successfully.",
    timesheetSubmitSuccess: "Timesheet submitted successfully.",
    timesheetSubmitError: "Failed to submit Timesheet.",
    timesheetCreateError: "Failed to create Timesheet.",
    timesheetUpdateError: "Failed to updated Timesheet.",
    timesheetsFetchError: "Failed to load Timesheets.",
    timesheetFetchError: "Failed to load Timesheet.",
    timesheetWithdrawSuccess: "Timesheet withdrawn successfully.",
    timesheetWithdrawError: "Failed to withdraw Timesheet.",
 }
