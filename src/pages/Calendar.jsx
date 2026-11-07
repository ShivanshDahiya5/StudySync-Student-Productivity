import CalendarView from '../components/CalendarView';

export default function Calendar() {
    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Calendar &amp; Deadlines</h1>
                    <p>See every assignment deadline at a glance and plan your week.</p>
                </div>
            </div>
            <CalendarView />
        </>
    );
}