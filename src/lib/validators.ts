import { z } from "zod";

export const eventSubmissionSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required").max(2000),
    dateTime: z.string().min(1, "Start date/time is required"),
    endDateTime: z.string().min(1, "End date/time is required"),
    location: z.string().min(1, "Location is required").max(500),
    organizerName: z.string().min(1, "Your name is required").max(200),
    organizerEmail: z.string().email("Valid email is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.dateTime);
      const end = new Date(data.endDateTime);
      return end > start;
    },
    { message: "End time must be after start time", path: ["endDateTime"] }
  );

export type EventSubmissionInput = z.infer<typeof eventSubmissionSchema>;
