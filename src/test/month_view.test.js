import React from 'react';
import {render} from '@testing-library/react';
import MonthView from '../month_view';
import moment from "moment";
import '@testing-library/jest-dom/extend-expect';


test('should render the month name', () => {
    let now = moment();
    const renderResult = render(<MonthView month={now}/>);

    const monthName = renderResult.getByText(now.format('MMMM'));
    expect(monthName).toBeInTheDocument();
});
test('should render Sun Mon Tues Wed Thu Fri Sat as headings', () => {
    let {getByText} = render(<MonthView/>);
    const sun = getByText('Sun');
    const mon = getByText('Mon');
    const tue = getByText('Tue');
    const wed = getByText('Wed');
    const thu = getByText('Thu');
    const fri = getByText('Fri');
    const sat = getByText('Sat');
    expect(sun).toBeInTheDocument();
    expect(mon).toBeInTheDocument();
    expect(tue).toBeInTheDocument();
    expect(wed).toBeInTheDocument();
    expect(thu).toBeInTheDocument();
    expect(fri).toBeInTheDocument();
    expect(sat).toBeInTheDocument();
});

test('should display a 7 x 6 grid of squares', () => {
    let month = moment();
    let {container} = render(<MonthView month={month}/>);
    let weeks = container.getElementsByClassName('week');
    expect(weeks.length).toBe(6);

    for (let w of weeks) {
        let days = w.getElementsByClassName('day');
        expect(days.length).toBe(7);
    }
});

test(`should map an array of data objects onto the calendar according to the 'date' property and provided render function`, () => {
    let now = moment();
    const data = [
        {date: moment(), text: 'my text 1'},
        {date: moment(), text: 'same day'},
        {date: moment().add(1, "day"), text: 'my text 2'},
        {date: moment().add(2, "day"), text: 'my text 3'},
        {date: moment().add(5, "day"), text: 'my text 4'},
        {date: moment().add(10, "day"), text: 'my text 5'},
    ];
    const renderFunction = (day) => {
        return <div>
            <span>{day.data[0] && day.data[0].text}</span><br/>
            <span>{day.data[1] && day.data[1].text}</span>
        </div>;
    };

    let {getByText} = render(<MonthView month={now} data={data} render={renderFunction} />);

    expect(getByText(data[0].text)).toBeInTheDocument();
    expect(getByText(data[1].text)).toBeInTheDocument();
    expect(getByText(data[2].text)).toBeInTheDocument();
    expect(getByText(data[3].text)).toBeInTheDocument();
    expect(getByText(data[4].text)).toBeInTheDocument();
    expect(getByText(data[5].text)).toBeInTheDocument();
});

test(`should map an array of data objects onto the calendar according to the provided dateKey prop`, () => {
    let now = moment();
    let dateKey = 'myDate';
    const data = [
        {myDate: moment(), text: 'my text 1'},
        {myDate: moment(), text: 'same day'},
        {myDate: moment().add(1, "day"), text: 'my text 2'},
        {myDate: moment().add(2, "day"), text: 'my text 3'},
        {myDate: moment().add(5, "day"), text: 'my text 4'},
        {myDate: moment().add(10, "day"), text: 'my text 5'},
    ];
    const renderFunction = (day) => {
        return <div>
            <span>{day.data[0] && day.data[0].text}</span><br/>
            <span>{day.data[1] && day.data[1].text}</span>
        </div>;
    };

    let {getByText} = render(<MonthView month={now} data={data} dateKey={dateKey} render={renderFunction} />);

    expect(getByText(data[0].text)).toBeInTheDocument();
    expect(getByText(data[1].text)).toBeInTheDocument();
    expect(getByText(data[2].text)).toBeInTheDocument();
    expect(getByText(data[3].text)).toBeInTheDocument();
    expect(getByText(data[4].text)).toBeInTheDocument();
    expect(getByText(data[5].text)).toBeInTheDocument();
});

test('should throw an error if the month prop is not a valid date', () => {
    const renderList = () => {
        render(<MonthView month={null}/>)
    };
    expect(renderList).toThrow(Error(`Prop \'month\' is not a valid Date or Moment. Value supplied: Invalid date`));
});

test('should throw an error if the data contains an invalid date', () => {
    let now = moment();
    const renderList = () => {
        render(<MonthView render={() => {}} data={[{date: null, title: 'bad'}]} month={now}/>)
    };
    expect(renderList).toThrow(Error("Date in data array is not a valid Date or Moment. Invalid date"));
});

test(`should throw an error if the data doesn't contain the dateKey prop`, () => {
    const now = moment();
    const wrongKey = 'wrongDateKey';
    const data = [{myDatetime: now, title: 'bad'}];

    const renderList = () => {
        render(<MonthView render={() => {}} dateKey={wrongKey} data={data} month={now}/>)
    };
    expect(renderList).toThrow(Error(`Date in data array is not a valid Date or Moment. Is '${wrongKey}' the correct key for your date field? Supply a dateKey prop if your date uses a different name that 'date'.`));
});


