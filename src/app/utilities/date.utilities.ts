export const getWorkingDays = (year: any, month: any) => {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return totalDays - nonWorkDays(year, month);
};

export function nonWorkDays(year: any, month: any)
{
  let current = new Date(year, month, 1);
  let daysOff = 0; //init
  // as long as our date is in the requested month
  while (current.getMonth() == month) {
    // saturday or sunday?
    if (current.getDay() == 0 || current.getDay() == 6) {
      daysOff++; 
    }
    // move to next day
    current.setDate(current.getDate() + 1);
  }
  return daysOff;
}