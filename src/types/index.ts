export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  endDateTime: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  dateTime: string;
  endDateTime: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  category: string;
}
