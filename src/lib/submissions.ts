export type ConsultationInput = {
  full_name: string;
  work_email: string;
  company: string;
  job_title: string;
  project_domain: string;
  company_size: string;
  global_presence: string;
  industry: string;
  estimated_budget: string;
  project_details: string;
};

export type ApplicationInput = {
  role: string;
  full_name: string;
  email: string;
  country: string;
  dial_code: string;
  phone: string;
  experience: string;
};

async function throwIfError(res: Response): Promise<void> {
  if (res.ok) return;
  let message = "Something went wrong. Please try again.";
  try {
    const data = await res.json();
    if (data?.error) message = data.error;
  } catch {
    /* keep default */
  }
  throw new Error(message);
}

/** Save the homepage hero email lead. */
export async function submitEmailLead(email: string): Promise<void> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  await throwIfError(res);
}

/** Save a consultation request. */
export async function submitConsultation(input: ConsultationInput): Promise<void> {
  const res = await fetch("/api/consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfError(res);
}

/** Upload the resume and save a job application. */
export async function submitApplication(input: ApplicationInput, resume: File): Promise<void> {
  const form = new FormData();
  (Object.keys(input) as (keyof ApplicationInput)[]).forEach((k) => form.append(k, input[k]));
  form.append("resume", resume);

  const res = await fetch("/api/application", { method: "POST", body: form });
  await throwIfError(res);
}
