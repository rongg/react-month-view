import React from 'react';
import PropTypes from 'prop-types';
import './css/month_view.css';
import moment from 'moment';

class MonthView extends React.Component {

    render() {
        let {month, data, render, dateKey} = this.props;

        if (typeof month === 'string' || typeof month === 'number' || typeof month === 'object') {
            month = moment(month);
        }
        if (!MonthView.isValidDate(month)) {
            throw new Error(`Prop 'month' is not a valid Date or Moment. Value supplied: ${month}`);
        }

        if (month instanceof Date) {
            month = moment(month);
        }

        if (!render || typeof render !== 'function') {
            console.info('Render function not supplied! Showing empty calendar. Supply a render prop to provide ' +
                'a custom template for each day in the calendar. See https://reactjs.org/docs/render-props.html');
            render = () => {
            };
        }

        let dataDays = MonthView.assignDataToDays(data, dateKey);
        const calendarDays = MonthView.getCalendarDays(dataDays, month, dateKey);


        let week = [];
        week[0] = calendarDays.slice(0, 7);
        week[1] = calendarDays.slice(7, 14);
        week[2] = calendarDays.slice(14, 21);
        week[3] = calendarDays.slice(21, 28);
        week[4] = calendarDays.slice(28, 35);
        week[5] = calendarDays.slice(35, calendarDays.length);


        const calendarRows = week.map((w, index) => (
            <div className='week row' key={'week-' + (index + 1)}>

                {w.map((day, index) => (
                    <div
                        className={`col day ${day[dateKey].isSame(moment(), 'day') ? 'today' : ''} ${day[dateKey].day() === 0 || day[dateKey].day() === 6 ? 'weekend' : ''}`}
                        key={'day-' + (index + 1)}>
                        <div className='num'>
                            <span
                                className={`date ${day[dateKey].isSame(month, 'month') ? '' : 'unfocus'}`}>{day[dateKey].date()}</span>
                        </div>
                        <div className={'day-data'}>
                            {day && render(day)}
                        </div>
                    </div>
                ))}
            </div>
        ));


        return <div>
            <div className='month-container'>
                <div className={'row month-name'} style={{borderBottom: 'none'}}>
                    <h1>{month.format('MMMM')}</h1>
                </div>
                <div className='header row'>
                    <div className='col'>Sun</div>
                    <div className='col'>Mon</div>
                    <div className='col'>Tue</div>
                    <div className='col'>Wed</div>
                    <div className='col'>Thu</div>
                    <div className='col'>Fri</div>
                    <div className='col'>Sat</div>
                </div>
                {calendarRows}
            </div>
        </div>
    }

    static assignDataToDays(data, dateKey) {
        const days = [];
        for (let i = 0; i < data.length; i++) {
            let date = data[i][dateKey];
            if (typeof date === 'string' || typeof date === 'number' || typeof date === 'object') {
                date = moment(date);
            }
            if (!MonthView.isValidDate(date)) {
                if (date === undefined) {
                    throw new Error(`Date in data array is not a valid Date or Moment. Is '${dateKey}' the correct key for your date field? Supply a dateKey prop if your date uses a different name that 'date'.`);
                } else {
                    throw new Error(`Date in data array is not a valid Date or Moment. ${date}`);
                }
            }
            const mDate = moment(date);
            const dayIndex = mDate.get('date');
            if (!days[dayIndex]) days[dayIndex] = [];
            days[dayIndex].push(data[i]);
        }

        return days;
    }

    static isValidDate(d) {
        return (d instanceof Date || d instanceof moment) && !isNaN(d);
    }

    static getCalendarDays(dataDays, month, dateKey) {
        let calendarDays = [];
        let noData = !dataDays || !dataDays.length;
        if (noData) {
            return MonthView.generateEmptyMonth(month, dateKey);
        }
        for (let i = 0; i <= month.daysInMonth(); i++) {
            const day = {
                data: dataDays[i] ? dataDays[i] : []
            };
            day[dateKey] = moment(month).date(i);
            calendarDays.push(day)
        }

        return MonthView.appendPreviousAndLastMonth(calendarDays, dateKey);
    }

    static appendPreviousAndLastMonth(calendarDays, dateKey) {
        const prevMonth = [];
        let firstDay = calendarDays[0];
        if (firstDay) {
            let dayNum = moment(firstDay[dateKey]).day();
            for (let i = dayNum * -1; i < 0; i++) {
                let date1 = moment(firstDay.date).add(i, 'day');
                const day = {
                    data: [],
                };
                day[dateKey] = date1;
                prevMonth.push(day);
            }
        }

        calendarDays = prevMonth.concat(calendarDays);

        let endIndex = calendarDays.length > 0 ? calendarDays.length - 1 : 0;
        let lastDay = calendarDays[endIndex];
        endIndex = lastDay[dateKey].day();
        let weekOverlap = 6 - endIndex;
        for (let i = 1; i <= weekOverlap; i++) {
            const day = {
                data: []
            };
            day[dateKey] = moment(lastDay[dateKey]).day(endIndex + i);
            calendarDays.push(day)
        }

        endIndex = calendarDays.length - 1;
        lastDay = calendarDays[endIndex];

        if (calendarDays.length < 42) {
            for (let i = 1; i <= 7; i++) {
                let date = lastDay[dateKey].date();
                const day = {
                    data: []
                };
                day[dateKey] = moment(lastDay[dateKey]).date(date + i);
                calendarDays.push(day)
            }
        }

        return calendarDays;
    }

    static generateEmptyMonth(month, dateKey) {
        let calendarDays = [];
        for (let i = 1; i <= month.daysInMonth(); i++) {
            const day = {
                data: []
            };
            day[dateKey] = moment(month).date(i);
            calendarDays.push(day);
        }

        return MonthView.appendPreviousAndLastMonth(calendarDays, dateKey);
    }

}

MonthView.defaultProps = {
    month: moment(),
    dateKey: 'date',
    data: [],
    render: null
};

// month, data, render, dateKey
MonthView.propTypes = {
    month: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.instanceOf(moment)
    ]),
    data: PropTypes.arrayOf(PropTypes.object),
    render: PropTypes.func,
    dateKey: PropTypes.string
};

export default MonthView;