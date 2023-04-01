import React, { useState, useEffect } from "react";
import CreateAppointment from "./CreateAppointment";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsList from "./AppointmentsList";

interface Appointment {
  id: number;
  start: Date;
  end: Date;
  title: string;
}

const appointmentsData: Appointment[] = [
  {
    id: 1,
    start: new Date(2023, 2, 30, 10, 0),
    end: new Date(2023, 2, 30, 11, 0),
    title: "Meeting with John",
  },
  {
    id: 2,
    start: new Date(2023, 2, 31, 14, 0),
    end: new Date(2023, 2, 31, 15, 0),
    title: "Lunch with Jane",
  },
  {
    id: 3,
    start: new Date(2023, 3, 1, 9, 0),
    end: new Date(2023, 3, 1, 10, 0),
    title: "Interview with Bob",
  },
];

const Appointments = (): JSX.Element => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const savedAppointments = await localStorage.getItem("appointments");
      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);
        const filteredAppointments = parsedAppointments.filter(
          (appointment: Appointment) =>
            !appointments.some((a) => a.id === appointment.id)
        );
        setAppointments([...appointments, ...filteredAppointments]);
      } else {
        setAppointments(appointmentsData);
      }
    };
    fetchData();
  }, [appointments]);

  return (
    <>
      <CreateAppointment
        appointments={appointments}
        setAppointments={setAppointments}
      />
      <div className="grid grid-cols-2 gap-2">
        <AppointmentsList appointments={appointments} />
        <AppointmentsCalendar appointments={appointments} />
      </div>
    </>
  );
};

export default Appointments;
