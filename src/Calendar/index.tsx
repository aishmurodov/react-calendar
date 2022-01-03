import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react"
import "./styles/index.scss"
import CalendarProps from "./interfaces/CalendarProps";

import defaultMonthNames from "./constants/monthNames"
import defaultWeekDayNames from "./constants/weekDayNames"
import defaultSelectingYears from "./constants/selectingYears"
import * as calendar from "./modules/index"

const Calendar: React.FunctionComponent<CalendarProps> = (props: PropsWithChildren<CalendarProps>) => {

    const [selectingYears] = useState<Array<number>>(props.years ?? defaultSelectingYears)
    const [monthNames] = useState<Array<string>>(props.locales && props.locales.month ? props.locales.month : defaultMonthNames)
    const [weekDayNames] = useState<Array<string>>(props.locales && props.locales.weekDay ? props.locales.weekDay : defaultWeekDayNames)

    const [monthData, setMonthDate] = useState<Array<Array<Date|undefined>>>([])

    const [date, setDate] = useState<Date>(new Date())
    const [currentDate] = useState<Date>(new Date())
    const [selectedDate, setSelectedDate] = useState<Date|null>(null)

    const monthSelectRef = useRef<HTMLSelectElement>(null)
    const yearSelectRef = useRef<HTMLSelectElement>(null)

    const handlePrevMonthButtonClick = useCallback(() => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1))
    }, [date])

    const handleNextMonthButtonClick = useCallback(() => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1))
    }, [date])

    const handleDayClick = useCallback((selectedDate: Date) => {
        setSelectedDate(selectedDate)

        if (props.onChange) {
            props.onChange({
                target: {
                    value: selectedDate
                }
            })
        }
    }, [props])

    const handleSelectChange = useCallback(() => {
        if (yearSelectRef.current && monthSelectRef.current ) {

            setDate(new Date(Number(yearSelectRef.current.value), Number(monthSelectRef.current.value)))
        }
    }, [yearSelectRef])

    useEffect(() => {

        setMonthDate(calendar.getMonthData(date.getFullYear(), date.getMonth()))

    }, [date])


    return <div className="Ai-Calendar">
        <header>
            <button onClick={handlePrevMonthButtonClick}>{"<"}</button>

            <select
                ref={monthSelectRef}
                onChange={handleSelectChange}
                value={date.getMonth()}
            >
                {monthNames.map((name, index) => {
                    return <option key={index} value={index}>
                        {name}
                    </option>
                })}
            </select>
            <select
                ref={yearSelectRef}
                onChange={handleSelectChange}
                value={date.getFullYear()}
            >
                {selectingYears.map((year) => {
                    return <option key={year} value={year}>
                        {year}
                    </option>
                })}
            </select>

            <button onClick={handleNextMonthButtonClick}>{">"}</button>
        </header>
        <table>
            <thead>
                <tr>
                    {weekDayNames.map((name, index) => {
                        return <td key={index}>
                            {name}
                        </td>
                    })}
                </tr>
            </thead>
            <tbody>
                {monthData.map((week, index) =>
                    <tr key={index} className="week">
                        {week.map((date, index) => {
                            return <td
                                onClick={() => {
                                    if (date) handleDayClick(date)
                                }}
                                key={index}
                                className={`day${date ? (`${calendar.areEqual(date, currentDate) ? " today" : ""}${selectedDate && calendar.areEqual(date, selectedDate) ? " selected" : ""}`) : ""}`}>{date ? date.getDate() : ""}</td>
                        })}
                    </tr>
                )}
            </tbody>
        </table>
    </div>

}

export default Calendar