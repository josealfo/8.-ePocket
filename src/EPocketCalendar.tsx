import React from 'react';
//import { useState } from 'react';
import Calendar from 'react-calendar';
import { formatEther } from 'ethers';

interface EPocketCalendarProps {
    establishedAmounts: number[] | undefined;
}
/* Receives an array with the establishedAmounts to display in the calendar*/
const EPocketCalendar: React.FC<EPocketCalendarProps> = ({ establishedAmounts }) => {

    //date object
    const currentDate = new Date();
    const yearAndMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    // Define an array with your data
    const data2: { date: string; event: string }[] = (establishedAmounts || []).map((amount, index) => ({
//        date: `2023-10-${index < 9 ? '0' : ''}${index + 1}`,
        date: `${yearAndMonth}-${index < 9 ? '0' : ''}${index + 1}`,
        event: `${formatEther(amount)} Eth`,
    }));
/* a try that did not work
    const data2: { date: string; event: string }[] = (establishedAmounts || []).map((amount, index) => (
        if (amount < 9) {
            return ({
                date: `2023-10-0${index + 1}`,
                event: `${formatEther(amount)} Eth`,
            });
        } else {
            return ({
                date: `2023-10-${index + 1}`,
                event: `${formatEther(amount)} Eth`,
            }); 
        }
    ));
*/
    //    const data = [];
    // beforefor now, hardcoded.... later read from smartContract
    const data = [
        { date: '2023-10-01', event: '0.01 Eth' },
        { date: '2023-10-02', event: '0.02 Eth' },
        { date: '2023-10-03', event: '0.03 Eth' },
        { date: '2023-10-04', event: '0.04 Eth' },
        { date: '2023-10-05', event: '0.05 Eth' },
        { date: '2023-10-06', event: '0.06 Eth' },
        { date: '2023-10-07', event: '0.07 Eth' },
        { date: '2023-10-08', event: '0.08 Eth' },
        { date: '2023-10-09', event: '0.09 Eth' },
        { date: '2023-10-10', event: '0.10 Eth' },
        { date: '2023-10-11', event: '0.11 Eth' },
        { date: '2023-10-12', event: '0.12 Eth' },
        { date: '2023-10-13', event: '0.13 Eth' },
        { date: '2023-10-14', event: '0.14 Eth' },
        { date: '2023-10-15', event: '0.15 Eth' },
        { date: '2023-10-16', event: '0.16 Eth' },
        { date: '2023-10-17', event: '0.17 Eth' },
        { date: '2023-10-18', event: '0.18 Eth' },
        { date: '2023-10-19', event: '0.19 Eth' },
        { date: '2023-10-20', event: '0.20 Eth' },
        { date: '2023-10-21', event: '0.21 Eth' },
        { date: '2023-10-22', event: '0.22 Eth' },
        { date: '2023-10-23', event: '0.23 Eth' },
        { date: '2023-10-24', event: '0.24 Eth' },
        { date: '2023-10-25', event: '0.25 Eth' },
        { date: '2023-10-26', event: '0.26 Eth' },
        { date: '2023-10-27', event: '0.27 Eth' },
        { date: '2023-10-28', event: '0.28 Eth' },
        { date: '2023-10-29', event: '0.29 Eth' },
        { date: '2023-10-30', event: '0.30 Eth' },
        { date: '2023-10-31', event: '0.31 Eth' },
    ];

    // Define a generic Range type, if not already provided by a library
 //   type Range<T> = [T, T];
    // Create a state variable to track the selected date
    //const [selectedDate, setSelectedDate] = useState<Date| null>(null);
    //const [selectedDate, setSelectedDate] = useState<Date | Range<Date> | null>(null);
    
    /***************** Debug logs ***********/
    // Get the current timestamp and format it
    const debugTimestamp = new Date();
    const formattedTimestamp = /*`${debugTimestamp.getFullYear()}-${(debugTimestamp.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${debugTimestamp.getDate().toString().padStart(2, '0')} */`${debugTimestamp.getHours().toString().padStart(2, '0')}:${debugTimestamp.getMinutes().toString().padStart(2, '0')}:${debugTimestamp.getSeconds().toString().padStart(2, '0')}`;
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: establishedAmounts is ', ${establishedAmounts}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data2 is ', ${data2}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data is ', ${data}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data[0].date is ', ${data[0].date}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data[0].event is ', ${data[0].event}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data[30].date is ', ${data[30].date}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data[30].event is ', ${data[30].event}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data2[0].date is ', ${data2[0].date}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data2[0].event is ', ${data2[0].event}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data2[30].date is ', ${data2[30].date}`);
    console.log(`${formattedTimestamp} EPocketCalendar.tsx: data2[30].event is ', ${data2[30].event}`);

    //setSelectedDate(new Date());
    // Function to render custom day content
    const customDayContent = ({ date, view }: { date: Date; view: string }) => {
        // Find data for the current date
        const eventData = data2.find((item) => item.date === date.toISOString().split('T')[0]);

        if (view === 'month' && eventData) {
            return (
                <div>
                    <div>{eventData.event}</div>
                </div>
            );
        }
        return ' ';
        //return date.getDate();
    };


    return (
        <div>
            <Calendar
                value={new Date()}
                tileContent={customDayContent}
            />
        </div>
    ); 
    /* value={selectedDate}
                 */
};

export { EPocketCalendar }
