import React from 'react';
import Calendar from 'react-calendar';
import { formatEther } from 'ethers';

interface EPocketCalendarProps {
    establishedAmounts: number[] | undefined;
}

/* Calendar component of the ePocket app
 * This is the main component of the app that displays, using the current month, a Calendar for the user to graphically see the amounts he or she can claim. 
 * It receives a establishedAmounts property, which is the array of establishedAmounts to display in the calendar. This array comes from the ePocket 
 * Smart Contract and define the amounts that can be claimed on each day of the month (0 indexed, so index 0 is for day 1st, index 1 for day 2nd and so on, 
 * until day 31, index 30), the values in each slot represent the amount that can be claimed, only once, for that particular day. This amount is in wei, 
 * with 18 digits for decimals, so must be converted to eth to display to the user*/
const EPocketCalendar: React.FC<EPocketCalendarProps> = ({ establishedAmounts }) => {
    const currentDate = new Date();
    const yearAndMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    // fill data2 object, with the establishedAmounts received from the Smart Contract,
    // the data2 here will be rendered as a calendar with the amounts to claim each day (in ether instead of weis)
    const data2: { date: string; event: string }[] = (establishedAmounts || []).map((amount, index) => ({
        date: `${yearAndMonth}-${index < 9 ? '0' : ''}${index + 1}`,
        event: `${formatEther(amount)} Eth`,
    }));

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
    };

    return (
        <div>
            <Calendar
                value={new Date()}
                tileContent={customDayContent}
            />
        </div>
    ); 
};

export { EPocketCalendar }
