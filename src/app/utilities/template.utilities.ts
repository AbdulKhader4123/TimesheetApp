import { Day, calendarData } from "../constants"

const DayType = {
    WEEKEND : "weekend",
    HOLIDAY : "holiday",
    WEEKDAY : "weekday"
}
export const generateTemplate = (month: number, year: number, holidayList: Date[], timeSheetName: string) => {
 return {
    month: month,
    year,
    days: generateDays(month, year, holidayList),
    name: timeSheetName
 }
}

function generateDays(month: number, year: number, holidayList: Date[]){
    let days = [];
    let currentDate = new Date(year, month, 1);
    const holidays = holidayList?.map(holiday => holiday.toString());
    // as long as our date is in the requested month
    while (currentDate.getMonth() == month) {
        const dayType = getDayType(currentDate, holidays);
        const day: Day = {
            day: calendarData.weekdays[currentDate.getDay()],
            date: `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`,
            type: dayType,
            normal_worked_hours: dayType === DayType.WEEKDAY ? 8 : 0,
            total_hours: dayType === DayType.WEEKDAY ? 8 : 0
        }
        days.push(day)
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
}

function getDayType(currentDate: Date, holidayList: string[]){
    if(holidayList?.includes(currentDate.toString())){
        return DayType.HOLIDAY;
    }
    else if(currentDate.getDay() === 0 || currentDate.getDay() === 6){
        return DayType.WEEKEND;
    }
    return DayType.WEEKDAY;
}