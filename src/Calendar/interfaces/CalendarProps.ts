import CalendarChangeEvent from "./CalendarChangeEvent";

export default interface CalendarProps {

    value?: string,
    required?: boolean,
    placeholder?: string,
    years?: Array<number>,
    locales?: {
        month?: Array<string>,
        weekDay?: Array<string>,
    },
    onChange?: (e: { target: CalendarChangeEvent}) => void
}