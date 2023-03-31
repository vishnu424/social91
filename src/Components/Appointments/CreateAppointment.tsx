import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import TimePicker, { TimePickerValue } from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";

interface Appointment {
  id: number;
  start: Date;
  end: Date;
  title: string;
}

interface Props {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const CreateAppointment = ({ appointments, setAppointments }: Props) => {
  const appointmentDuration = 60;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimePickerValue | null>(
    null
  );
  const [title, setTitle] = useState("");

  function findNextAvailableSlot(
    existingAppointments: Appointment[],
    appointmentDuration: number,
    preferredStartTime?: Date
  ) {
    const sortedAppointments = [...existingAppointments].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    const now = new Date();
    const startTime = preferredStartTime
      ? new Date(
          preferredStartTime.getFullYear(),
          preferredStartTime.getMonth(),
          preferredStartTime.getDate(),
          preferredStartTime.getHours(),
          preferredStartTime.getMinutes(),
          0,
          0
        )
      : now;
    let endTime = new Date(startTime.getTime() + appointmentDuration * 60000);

    for (let i = 0; i < sortedAppointments.length; i++) {
      const appointment = sortedAppointments[i];
      const appointmentEnd = new Date(appointment.end);
      if (appointmentEnd <= startTime) {
        continue;
      }
      const appointmentStart = new Date(
        appointmentEnd.getTime() - appointmentDuration * 60000
      );
      if (appointmentStart >= endTime) {
        return { startTime, endTime };
      }
      startTime.setTime(appointmentEnd.getTime() + 86400000);
      endTime.setTime(startTime.getTime() + appointmentDuration * 60000);
    }

    startTime.setTime(
      Math.max(
        startTime.getTime(),
        sortedAppointments.length
          ? new Date(
              sortedAppointments[sortedAppointments.length - 1].end
            ).getTime() + 86400000
          : now.getTime()
      )
    );
    endTime.setTime(startTime.getTime() + appointmentDuration * 60000);

    return { startTime, endTime };
  }

  const handleCreateAppointment = () => {
    if (selectedDate && selectedTime !== null) {
      const selectedTimeString = selectedTime.toString();
      const [selectedHours, selectedMinutes] = selectedTimeString
        .split(":")
        .map(Number);
      const startTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedHours,
        selectedMinutes
      );

      const { startTime: suggestedStartTime, endTime: suggestedEndTime } =
        findNextAvailableSlot(appointments, appointmentDuration, startTime);

      console.log(suggestedEndTime, "suggestedEndTime");

      const conflictingAppointment = appointments.find((appointment) => {
        const appointmentEndTime = new Date(
          new Date(appointment.start).getTime() + appointmentDuration * 60000
        );
        return (
          new Date(appointment.start).getTime() <= startTime.getTime() &&
          appointmentEndTime.getTime() >= startTime.getTime()
        );
      });
      if (conflictingAppointment) {
        alert(
          "There is already an appointment scheduled at the selected time. Please select a different time."
        );
      } else {
        const newAppointment = {
          id: appointments.length + 1,
          start: suggestedStartTime,
          end: suggestedEndTime,
          title: title,
        };
        setAppointments([...appointments, newAppointment]);
        // setSelectedDate(null);
        // setSelectedTime(null);
        // setTitle("");
      }
    } else {
      alert("Please select a date and time for the appointment.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
      <div className="grid grid-cols-2 gap-4">
        <label htmlFor="date-picker">Date:</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border-gray-300 border rounded-lg py-2 px-4"
          dateFormat="MMMM d, yyyy"
        />
        <label htmlFor="time-picker">Time:</label>
        <TimePicker
          id="time-picker"
          value={selectedTime || ""}
          onChange={(time) => setSelectedTime(time)}
          className="border-gray-300 border rounded-lg py-2 px-4"
          disableClock
          format="h:mm a"
        />

        <label htmlFor="title" className="">
          Title:
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="appearance-none border-gray-300 border rounded-lg py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button
        onClick={handleCreateAppointment}
        className="mt-4 bg-blue-500 text-white rounded-lg py-2 px-4"
      >
        Create Appointment
      </button>
    </div>
  );
};

export default CreateAppointment;
