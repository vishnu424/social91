import React, { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";

import "react-calendar/dist/Calendar.css";

interface Appointment {
  id: number;
  start: Date | string;
  end: Date | string;
  title: string;
}

interface Props {
  appointments: Appointment[];
}

const AppointmentsCalendar = ({ appointments }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointmentsOnSelectedDate = appointments.filter((appointment) => {
    const start =
      appointment.start instanceof Date
        ? appointment.start
        : new Date(appointment.start);
    return start.toDateString() === selectedDate.toDateString();
  });

  const handleCalendarChange = (value: any) => {
    setSelectedDate(value);
  };

  return (
    <div className="p-4 flex flex-col items-center w-100 w-100">
      <div>
        <h2 className="text-2xl font-bold mb-4">Appointments Calendar</h2>
        <Calendar
          className="mb-4"
          value={selectedDate}
          onChange={handleCalendarChange}
        />
        <div key={selectedDate.toDateString()} className="my-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDate.toDateString()}
          </h2>
          <ul>
            {appointmentsOnSelectedDate.length === 0 ? (
              <li>No appointments scheduled</li>
            ) : (
              appointmentsOnSelectedDate.map(({ id, title, start, end }) => {
                const startDate =
                  start instanceof Date ? start : new Date(start);
                const endDate = end instanceof Date ? end : new Date(end);
                return (
                  <li key={id}>
                    <div className="text-sm font-medium text-gray-900">
                      {title}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {format(startDate, "h:mm a")} -{" "}
                      {format(endDate, "h:mm a")}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>{" "}
      </div>
    </div>
  );
};

export default AppointmentsCalendar;
