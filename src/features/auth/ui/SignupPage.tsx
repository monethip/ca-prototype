import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { RegisterCertificate, EMPTY_ENROLL, enrollToCert, hasRequiredUploads, saveCerts } from "../../certificates";
import {
  BillingForm,
  EMPTY_BUYER,
  PackageSelect,
  PaymentStep,
  applyPaidOrder,
  clearCheckoutSession,
  createOrder,
  createPayment,
  historyRowFromPaid,
  isBuyerComplete,
  persistCheckout,
  qrPayload,
} from "../../checkout";
import { writeHistory } from "../../invoices";
import { downloadInvoiceHtml } from "../../invoices/model/invoice";
import InvoicePreview from "../../invoices/ui/InvoicePreview";
import { nonce } from "../../../shared/lib/format";
import type { Buyer, Certificate, DurationYears, EnrollForm, Invoice, Order, PackageName, Payment } from "../../../types";
import ContactFab from "./ContactFab";

type SignupStep = "register" | "package" | "billing" | "payment" | "success";

const SIGNUP_STEPS: Array<{ id: SignupStep; label: string }> = [
  { id: "register", label: "Account" },
  { id: "package", label: "Plan" },
  { id: "billing", label: "Billing" },
  { id: "payment", label: "Payment" },
  { id: "success", label: "Done" },
];

function SignupProgress({
  step,
  onStep,
}: {
  step: SignupStep;
  onStep: (next: SignupStep) => void;
}) {
  const stepIndex = SIGNUP_STEPS.findIndex((s) => s.id === step);
  const success = step === "success";
  return (
    <div className={"process-progress signup-progress" + (success ? " success" : "")} aria-label="Create account progress">
      <ol className="process-steps">
        {SIGNUP_STEPS.map((s, i) => {
          const state = success || i < stepIndex ? "done" : i === stepIndex ? "current" : "";
          const clickable = !success && i < stepIndex && s.id !== "success";
          return (
            <li key={s.id} className={state}>
              {clickable ? (
                <button type="button" onClick={() => onStep(s.id)}>
                  <span className="process-dot">{i + 1}</span>
                  {s.label}
                </button>
              ) : (
                <span className="process-label">
                  <span className="process-dot">{i + 1}</span>
                  {s.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("register");
  const [form, setForm] = useState<EnrollForm>({ ...EMPTY_ENROLL });
  const [enrollError, setEnrollError] = useState(false);
  const [draftCert, setDraftCert] = useState<Certificate | null>(null);
  const [pkg, setPkg] = useState<PackageName>("Premium");
  const [years, setYears] = useState<DurationYears>(1);
  const [buyer, setBuyer] = useState<Buyer>({ ...EMPTY_BUYER });
  const [buyerError, setBuyerError] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [pay, setPay] = useState<Payment | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [ttl, setTtl] = useState(15);

  useEffect(() => {
    if (step !== "payment" || !pay || !order || pay.status === "paid") return;
    let cancelled = false;
    let seconds = 15;
    const draw = (current: Payment) => {
      QRCode.toDataURL(qrPayload(current, order), { width: 232, margin: 1, errorCorrectionLevel: "M" })
        .then((url) => { if (!cancelled) setQrUrl(url); });
    };
    setTtl(seconds);
    draw(pay);
    const timer = setInterval(() => {
      seconds -= 1;
      if (seconds === 0) {
        seconds = 15;
        setPay((current) => {
          if (!current || current.status === "paid") return current;
          const next = { ...current, nonce: nonce() };
          sessionStorage.setItem("ca_prototype_payment", JSON.stringify(next));
          draw(next);
          return next;
        });
      }
      setTtl(seconds);
    }, 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [step, pay?.ref, pay?.status, order]);

  function submitEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity() || !form.phone.trim() || !form.email.trim() || !form.personalName.trim() || !form.tin.trim() || !hasRequiredUploads(form) || !form.identityType || !form.identityNumber.trim()) {
      setEnrollError(true);
      return;
    }
    setEnrollError(false);
    setDraftCert(enrollToCert(form));
    setPkg(form.pkg);
    setYears(form.years);
    const [firstName, ...lastName] = form.personalName.trim().split(/\s+/);
    setBuyer({ ...EMPTY_BUYER, firstName, lastName: lastName.join(" "), email: form.email.trim(), phone: form.phone.trim(), company: form.organization });
    setStep("package");
  }

  function submitBuyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draftCert || !isBuyerComplete(buyer)) {
      setBuyerError(true);
      return;
    }
    setBuyerError(false);
    const nextOrder = createOrder({ pkg, years, buyer, cert: draftCert, kind: "issue" });
    const nextPay = createPayment();
    persistCheckout(nextOrder, nextPay);
    setOrder(nextOrder);
    setPay(nextPay);
    setStep("payment");
  }

  function confirmPayment(paymentMethod = "QR Payment") {
    if (!pay || !order || !draftCert || pay.status === "paid") return;
    const paidAt = new Date().toISOString();
    const nextPay: Payment = { ...pay, status: "paid", paidAt };
    const nextInvoice: Invoice = {
      id: "INV-" + order.id.slice(4),
      order,
      paymentRef: nextPay.ref,
      issuedAt: paidAt,
      paymentMethod,
    };
    const email = form.email.trim();
    saveCerts(email, applyPaidOrder([draftCert], order, nextInvoice, nextPay.ref));
    writeHistory(email, [historyRowFromPaid(order, nextInvoice, nextPay, email)]);
    sessionStorage.setItem("ca_prototype_payment", JSON.stringify(nextPay));
    sessionStorage.setItem("ca_prototype_invoice", JSON.stringify(nextInvoice));
    setPay(nextPay);
    setInvoice(nextInvoice);
    setStep("success");
  }

  function goToStep(next: SignupStep) {
    if (step === "payment" && next !== "payment") {
      clearCheckoutSession();
      setPay(null);
      setOrder(null);
    }
    setStep(next);
  }

  return (
    <div className="login-page">
      <header className="login-head">
        <nav className="top-nav">
          <Link className="brand" to="/login">
            <span className="mark" aria-hidden="true"></span>
            CA - Prototype
          </Link>
        </nav>
      </header>
      <main>
        <div className="signup-form">
          <SignupProgress step={step} onStep={goToStep} />
          {step === "register" && (
            <RegisterCertificate
              mode="account"
              form={form}
              error={enrollError}
              onChange={setForm}
              onClear={() => { setEnrollError(false); setForm({ ...EMPTY_ENROLL }); }}
              onSubmit={submitEnrollment}
            />
          )}
          {step === "package" && draftCert && (
            <PackageSelect
              kind="issue"
              cert={draftCert}
              pkg={pkg}
              years={years}
              onPkg={setPkg}
              onYears={setYears}
              onCancel={() => goToStep("register")}
              onContinue={() => goToStep("billing")}
            />
          )}
          {step === "billing" && draftCert && (
            <BillingForm
              cert={draftCert}
              pkg={pkg}
              years={years}
              buyer={buyer}
              error={buyerError}
              onChange={setBuyer}
              onBack={() => goToStep("package")}
              onSubmit={submitBuyer}
            />
          )}
          {step === "payment" && pay && order && (
            <PaymentStep qrUrl={qrUrl} pay={pay} order={order} ttl={ttl} onConfirm={confirmPayment} />
          )}
          {step === "success" && invoice && (
            <section className="view on payment-success">
              <div className="payment-success-head" role="status">
                <div className="success-mark" aria-hidden="true">✓</div>
                <p className="step-kicker">PAYMENT SUCCESS</p>
                <h1>Request submitted</h1>
                <p className="lede">Your payment is confirmed and your certificate request is pending review. Your username and password will be sent to {form.email} after your account is set up.</p>
                <p className="login-notice">This prototype does not send email.</p>
              </div>
              <InvoicePreview invoice={invoice} email={form.email} />
              <div className="invoice-actions payment-success-actions">
                <Link className="btn btn-secondary" to="/login">Back to sign in</Link>
                <button className="btn btn-pay" type="button" onClick={() => downloadInvoiceHtml(invoice, form.email)}>Download invoice</button>
              </div>
            </section>
          )}
          {/* {step === "register" ? <p className="note">Already have an account? <Link to="/login">Sign in</Link></p> : null} */}
        </div>
      </main>
      <footer className="login-foot">
        <div className="login-foot-inner">
          <p>© 2026 CA Prototype. All rights reserved.</p>
        </div>
      </footer>
      <ContactFab />
    </div>
  );
}
