import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../../auth";
import FileDropCard from "../../../shared/ui/FileDropCard";
import type { EnrollForm } from "../../../types";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  invalid?: boolean;
  children: ReactNode;
}

function Field({ id, label, required, invalid, children }: FieldProps) {
  return (
    <div className="field" data-invalid={invalid || undefined}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

interface FileFieldProps {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  invalid?: boolean;
  value: string;
  onChange: (value: string) => void;
}

function FileField({ id, label, placeholder, required, invalid, value, onChange }: FileFieldProps) {
  return (
    <div className="field" data-invalid={invalid || undefined}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      <FileDropCard id={id} required={required} invalid={invalid} value={value} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}

const MOCK_ENROLL: Omit<EnrollForm, "pkg" | "years"> = {
  phone: "+856 20 5555 0202",
  email: "noy.sengthong@example.la",
  purpose: "enterprise",
  authMode: "pin",
  activityDeclarationPhoto: "activity-declaration.jpg",
  businessLicense: "business-license.pdf",
  idCardPhoto: "id-card.jpg",
  serviceRegistrationDocument: "service-registration.pdf",
  handoverMinutes: "handover-minutes.pdf",
  identityType: "ppid",
  identityNumber: "P1234567",
  personalName: "Noy Sengthong",
  tin: "TIN-01022026",
  organization: "Vientiane Digital Trust Co., Ltd.",
  organizationUnit: "Certificate Operations",
  title: "Operations Manager",
  locality: "Vientiane",
  state: "Vientiane Capital",
  username: "noy.sengthong",
};

interface RegisterCertificateProps {
  form: EnrollForm;
  error: boolean;
  onChange: (form: EnrollForm) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mode?: "certificate" | "account";
}

export default function RegisterCertificate({ form, error, onChange, onClear, onSubmit, mode = "certificate" }: RegisterCertificateProps) {
  const navigate = useNavigate();

  function set<K extends keyof EnrollForm>(key: K, value: EnrollForm[K]) {
    onChange({ ...form, [key]: value });
  }

  function backToSignIn() {
    onClear();
    clearSession();
    navigate("/login");
  }

  function fillMockData() {
    onChange({ ...form, ...MOCK_ENROLL, email: form.email || MOCK_ENROLL.email });
  }

  return (
    <section className="view on">
      <form className={"about-form" + (error ? " has-errors" : "")} noValidate onSubmit={onSubmit}>
        <div className="about-head">
          <h1>{mode === "account" ? "Create an account" : "Register certificate"}</h1>
          <button className="btn btn-secondary mock-fill-btn" type="button" onClick={fillMockData}>
            Fill mock data
          </button>

        </div>



        <div className="about-row">
          <div className="about-legend">
            <h2>Owner information</h2>
            <p>Provide your contact details</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">

              <Field id="enrollPhone" label="Phone Number" required invalid={error && !form.phone.trim()}>
                <input
                  id="enrollPhone"
                  type="tel"
                  placeholder="e.g. +856 20 5555 0202"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field id="enrollEmail" label="Email" required invalid={error && !form.email.trim()}>
                <input
                  id="enrollEmail"
                  type="email"
                  placeholder="e.g. name@example.com"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="about-row">
          <div className="about-legend">
            <h2>Certificate information</h2>
            <p>Purpose, authentication, and documents</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">
              <Field id="enrollPurpose" label="Certificate Purpose" required>
                <select
                  id="enrollPurpose"
                  required
                  value={form.purpose}
                  onChange={(e) => set("purpose", e.target.value)}
                >
                  <option value="enterprise">Enterprise</option>
                  <option value="staff">Staff</option>
                  <option value="personal">Personal</option>
                </select>
              </Field>
              <Field id="enrollAuth" label="Authentication Modes" required>
                <select
                  id="enrollAuth"
                  required
                  value={form.authMode}
                  onChange={(e) => set("authMode", e.target.value)}
                >
                  <option value="pin">PIN</option>
                  <option value="tse">TSE</option>
                </select>
              </Field>
            </div>
            <FileField
              id="enrollActivityDeclaration"
              label="Photo of activity declaration"
              placeholder="Upload activity declaration photo"
              required
              invalid={error && !form.activityDeclarationPhoto}
              value={form.activityDeclarationPhoto}
              onChange={(name) => set("activityDeclarationPhoto", name)}
            />
            <FileField
              id="enrollBusinessLicense"
              label="Business license"
              placeholder="Upload business license"
              required
              invalid={error && !form.businessLicense}
              value={form.businessLicense}
              onChange={(name) => set("businessLicense", name)}
            />
            <FileField
              id="enrollIdCardPhoto"
              label="Photo of ID card"
              placeholder="Upload ID card photo"
              required
              invalid={error && !form.idCardPhoto}
              value={form.idCardPhoto}
              onChange={(name) => set("idCardPhoto", name)}
            />
            <FileField
              id="enrollServiceRegistration"
              label="Service Registration Document"
              placeholder="Upload service registration document"
              required
              invalid={error && !form.serviceRegistrationDocument}
              value={form.serviceRegistrationDocument}
              onChange={(name) => set("serviceRegistrationDocument", name)}
            />
            <FileField
              id="enrollHandoverMinutes"
              label="Minutes of Handover"
              placeholder="Upload minutes of handover"
              required
              invalid={error && !form.handoverMinutes}
              value={form.handoverMinutes}
              onChange={(name) => set("handoverMinutes", name)}
            />
            <div className="about-grid">
              <Field id="enrollIdType" label="Personal ID (PID) / Passport ID (PPID)" required>
                <select
                  id="enrollIdType"
                  required
                  value={form.identityType}
                  onChange={(e) => onChange({ ...form, identityType: e.target.value as EnrollForm["identityType"], identityNumber: "" })}
                >
                  <option value="">Select ID type</option>
                  <option value="pid">Personal ID (PID)</option>
                  <option value="ppid">Passport ID (PPID)</option>
                </select>
              </Field>
              {form.identityType ? (
                <Field id="enrollIdNumber" label={form.identityType === "pid" ? "Personal ID number" : "Passport ID number"} required invalid={error && !form.identityNumber.trim()}>
                  <input
                    id="enrollIdNumber"
                    type="text"
                    placeholder={form.identityType === "pid" ? "Enter personal ID number" : "Enter passport number"}
                    required
                    value={form.identityNumber}
                    onChange={(e) => set("identityNumber", e.target.value)}
                  />
                </Field>
              ) : null}
            </div>
          </div>
        </div>

        <div className="about-row">
          <div className="about-legend">
            <h2>Enroll certificate request</h2>
            <p>Identity used on the certificate</p>
          </div>
          <div className="about-fields">
            <div className="about-grid">
              <Field id="enrollName" label="Personal Name" required invalid={error && !form.personalName.trim()}>
                <input
                  id="enrollName"
                  placeholder="e.g. Noy Sengthong"
                  required
                  value={form.personalName}
                  onChange={(e) => set("personalName", e.target.value)}
                />
              </Field>
              <Field id="enrollTin" label="Tax code (TIN)" required invalid={error && !form.tin.trim()}>
                <input
                  id="enrollTin"
                  placeholder="Enter tax code"
                  required
                  value={form.tin}
                  onChange={(e) => set("tin", e.target.value)}
                />
              </Field>
              <Field id="enrollOrg" label="Organization">
                <input id="enrollOrg" placeholder="Enter organization name" value={form.organization} onChange={(e) => set("organization", e.target.value)} />
              </Field>
              <Field id="enrollOu" label="Organization Unit">
                <input
                  id="enrollOu"
                  placeholder="Enter organization unit"
                  value={form.organizationUnit}
                  onChange={(e) => set("organizationUnit", e.target.value)}
                />
              </Field>
              <Field id="enrollTitle" label="Title">
                <input id="enrollTitle" placeholder="Enter job title" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field id="enrollLocality" label="Locality">
                <input id="enrollLocality" placeholder="Enter city or district" value={form.locality} onChange={(e) => set("locality", e.target.value)} />
              </Field>
              <Field id="enrollState" label="State or Province">
                <input id="enrollState" placeholder="Enter state or province" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
              {mode === "certificate" ? (
                <Field id="enrollUser" label="Username" required invalid={error && !form.username.trim()}>
                  <input
                    id="enrollUser"
                    placeholder="Choose a username"
                    required
                    value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                  />
                </Field>
              ) : null}
            </div>
          </div>
        </div>

        {error ? <p className="form-err on">Please complete required fields, attach all documents, and enter your ID number.</p> : null}
        <div className="invoice-actions">
          <button className="btn btn-secondary" type="button" onClick={backToSignIn}>
            Back to Sign in
          </button>
          <button className="btn btn-pay" type="submit">
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
