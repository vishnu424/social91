import React from "react";
import { format } from "date-fns";

interface Appointment {
  id: number;
  start: Date | string;
  end: Date | string;
  title: string;
}

interface Props {
  appointments: Appointment[];
}

const AppointmentsList: React.FC<Props> = ({ appointments }: Props) => {
  return (
    <div className="flex flex-col items-center p-4 w-100">
      <h2 className="text-2xl font-bold mb-4">Appointments List</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <span className="font-bold">Title</span>
        <span className="font-bold">Start</span>
        <span className="font-bold">End</span>
      </div>
      {appointments.length === 0 ? (
        <p>No appointments scheduled</p>
      ) : (
        appointments.map((appointment, index) => (
          <div
            key={index + ""}
            className="grid grid-cols-3 gap-4 mb-4 border-b py-4"
          >
            <span>{appointment.title}</span>
            <span>
              {format(new Date(appointment.start), "MMM d, yyyy h:mm a")}
            </span>
            <span>
              {format(new Date(appointment.end), "MMM d, yyyy h:mm a")}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentsList;
