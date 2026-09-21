import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { clearSession, readSession } from "../../auth";
import { CertificateList, PricingView, RegisterCertificate, defaultCerts, loadCerts, saveCerts, EMPTY_ENROLL, enrollToCert, hasRequiredUploads } from "../../certificates";
import {
  BillingForm,
  EMPTY_BUYER,
  PackageSelect,
  PaymentStep,
  PaymentSuccess,
  applyPaidOrder,
  clearCheckoutSession,
  createOrder,
  createPayment,
  historyRowFromPaid,
  isBuyerComplete,
  persistCheckout,
  qrPayload,
} from "../../checkout";
import { InvoiceView, PaymentHistory, defaultHistory, userHistory, writeHistory } from "../../invoices";
import { nonce } from "../../../shared/lib/format";
import PortalChrome from "./PortalChrome";
import type { Certificate, DurationYears, EnrollForm, Invoice, Order, PackageName, Payment, PaymentHistoryRow, PortalView, Session } from "../../../types";

const PAYMENT_VIEWS: PortalView[] = ["package", "billing", "qr"];

function initialCertsForSession(session: Session | null): Certificate[] {
  const accountName = session?.username || session?.email || "";
  if (!accountName) return [];
  const rows = loadCerts(accountName);
  if (!session?.isNew && rows.length === 0) {
    const seeded = defaultCerts();
    saveCerts(accountName, seeded);
    return seeded;
  }
  return rows;
}

export default function PortalPage() {
  const navigate = useNavigate();
  const session = useMemo(() => readSession(), []);
  const accountName = session?.username || session?.email || "";
  const initialCerts = useMemo(() => initialCertsForSession(session), [session]);
  const [view, setView] = useState<PortalView>(() => {
    if (!accountName) return "certs";
    return session?.isNew && initialCerts.length === 0 ? "register" : "certs";
  });
  const [certs, setCerts] = useState<Certificate[]>(() => initialCerts);
  const [enroll, setEnroll] = useState<EnrollForm>(() => ({ ...EMPTY_ENROLL, email: session?.email || "" }));
  const [enrollErr, setEnrollErr] = useState(false);
  const [history, setHistory] = useState<PaymentHistoryRow[]>(() => (accountName ? userHistory(accountName) : []));
  const [toastMsg, setToastMsg] = useState("");
  const [pkg, setPkg] = useState<PackageName>("Premium");
  const [years, setYears] = useState<DurationYears>(1);
  const [certId, setCertId] = useState<string | null>(null);
  const [draftCert, setDraftCert] = useState<Certificate | null>(null);
  const [buyer, setBuyer] = useState(EMPTY_BUYER);
  const [buyerErr, setBuyerErr] = useState(false);
  const [ttl, setTtl] = useState(15);
  const [qrUrl, setQrUrl] = useState("");
  const [pay, setPay] = useState<Payment | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const leaveFn = useRef<(() => void) | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 4000);
  }, []);

  useEffect(() => {
    if (!session?.token) navigate("/login", { replace: true });
  }, [session, navigate]);

  useEffect(() => {
    if (!session?.email) return;
    setBuyer((b) => ({ ...b, email: b.email || session.email }));
  }, [session]);

  const currentCert = certs.find((c) => c.id === certId) || (draftCert?.id === certId ? draftCert : null);
  const paymentOpen = PAYMENT_VIEWS.includes(view);

  function requestLeave(next: () => void) {
    if (!paymentOpen) {
      next();
      return;
    }
    leaveFn.current = next;
    setLeaveOpen(true);
  }

  function stayOnPayment() {
    leaveFn.current = null;
    setLeaveOpen(false);
  }

  function leavePayment() {
    const next = leaveFn.current;
    leaveFn.current = null;
    setLeaveOpen(false);
    if (qrTimer.current) clearInterval(qrTimer.current);
    clearCheckoutSession();
    setPay(null);
    setOrder(null);
    if (next) next();
  }

  function showCerts() {
    setView("certs");
  }

  function startExtend(id: string) {
    setCertId(id);
    setDraftCert(null);
    clearCheckoutSession();
    setPay(null);
    setOrder(null);
    setInvoice(null);
    setView("package");
  }

  function resetToDefault() {
    if (qrTimer.current) clearInterval(qrTimer.current);
    clearCheckoutSession();
    const next = defaultCerts();
    saveCerts(accountName, next);
    setCerts(next);
    const hist = defaultHistory(accountName);
    writeHistory(accountName, hist);
    setHistory(hist);
    setCertId(null);
    setYears(1);
    setPkg("Premium");
    setPay(null);
    setOrder(null);
    setInvoice(null);
    toast("Reset to default test data.");
    setView("certs");
  }

  async function drawQr(currentPay: Payment, currentOrder: Order) {
    const url = await QRCode.toDataURL(qrPayload(currentPay, currentOrder), {
      width: 232,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    setQrUrl(url);
  }

  useEffect(() => {
    if (view !== "qr" || !pay || !order) return undefined;
    setTtl(15);
    drawQr(pay, order);
    if (qrTimer.current) clearInterval(qrTimer.current);
    qrTimer.current = setInterval(() => {
      setPay((current) => {
        if (!current || current.status === "paid") {
          if (qrTimer.current) clearInterval(qrTimer.current);
          return current;
        }
        setTtl((n) => {
          if (n <= 1) {
            const next = { ...current, nonce: nonce() };
            sessionStorage.setItem("ca_prototype_payment", JSON.stringify(next));
            drawQr(next, order);
            return 15;
          }
          return n - 1;
        });
        return current;
      });
    }, 1000);
    return () => {
      if (qrTimer.current) clearInterval(qrTimer.current);
    };
  }, [view, pay?.ref, order?.id, pay?.status]);

  function submitBuyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isBuyerComplete(buyer)) {
      setBuyerErr(true);
      return;
    }
    setBuyerErr(false);
    if (!currentCert) return;
    const nextOrder = createOrder({ pkg, years, buyer, cert: currentCert, kind: draftCert ? "issue" : "extend" });
    const nextPay = createPayment();
    persistCheckout(nextOrder, nextPay);
    setOrder(nextOrder);
    setPay(nextPay);
    setView("qr");
  }

  function simulatePay(paymentMethod = "QR Payment") {
    if (!pay || !order || pay.status === "paid") return;
    const paidAt = new Date().toISOString();
    const nextPay: Payment = { ...pay, status: "paid", paidAt };
    const inv: Invoice = {
      id: "INV-" + order.id.slice(4),
      order,
      paymentRef: nextPay.ref,
      issuedAt: paidAt,
      paymentMethod,
    };
    sessionStorage.setItem("ca_prototype_payment", JSON.stringify(nextPay));
    sessionStorage.setItem("ca_prototype_invoice", JSON.stringify(inv));
    const rows = [historyRowFromPaid(order, inv, nextPay, accountName), ...history];
    writeHistory(accountName, rows);
    setHistory(rows);
    const nextCerts = applyPaidOrder(draftCert ? [...certs, draftCert] : certs, order, inv, nextPay.ref);
    saveCerts(accountName, nextCerts);
    setCerts(nextCerts);
    setPay(nextPay);
    setInvoice(inv);
    if (qrTimer.current) clearInterval(qrTimer.current);
    toast(order.kind === "issue" ? "Payment successful. Certificate request pending review." : "Payment successful. Certificate and payment history updated.");
    setView("success");
  }

  if (!session?.token) return null;

  return (
    <PortalChrome
      email={accountName}
      view={view}
      onCerts={() => requestLeave(showCerts)}
      onPricing={() => requestLeave(() => setView("pricing"))}
      onHistory={() => requestLeave(() => setView("history"))}
      onCrumb={(id) => {
        if (PAYMENT_VIEWS.includes(id)) setView(id);
        else requestLeave(() => setView(id));
      }}
      onBack={() => {
        if (view === "package") requestLeave(() => setView(draftCert ? "register" : "certs"));
        else if (view === "invoice" || view === "success" || view === "register") setView("certs");
        else if (view === "billing") setView("package");
        else if (view === "qr") setView("billing");
        else setView("certs");
      }}
      onLogout={() =>
        requestLeave(() => {
          clearSession();
          navigate("/login");
        })
      }
    >
      <main className="wrap">
        {view === "certs" && (
          <CertificateList
            certs={certs}
            email={accountName}
            onReset={resetToDefault}
            onExtend={startExtend}
            onRegister={() => {
              if (certs.length) {
                toast("This account already has a certificate. Renew it instead of registering another.");
                return;
              }
              setEnrollErr(false);
              setEnroll((e) => ({ ...EMPTY_ENROLL, ...e, email: session.email || "" }));
              setView("register");
            }}
          />
        )}
        {view === "register" && (
          <RegisterCertificate
            form={enroll}
            error={enrollErr}
            onChange={setEnroll}
            onClear={() => {
              setEnrollErr(false);
              setEnroll({ ...EMPTY_ENROLL, email: session.email || "" });
            }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!e.currentTarget.checkValidity() || !enroll.phone.trim() || !enroll.email.trim() || !enroll.personalName.trim() || !enroll.tin.trim() || !enroll.username.trim() || !hasRequiredUploads(enroll) || !enroll.identityType || !enroll.identityNumber.trim()) {
                setEnrollErr(true);
                return;
              }
              setEnrollErr(false);
              if (certs.length) {
                toast("This account already has a certificate.");
                setView("certs");
                return;
              }
              const draft = enrollToCert(enroll);
              setDraftCert(draft);
              setCertId(draft.id);
              setPkg(enroll.pkg);
              setYears(enroll.years);
              setBuyer((current) => ({ ...current, email: enroll.email, phone: enroll.phone, company: enroll.organization }));
              setView("package");
            }}
          />
        )}
        {view === "pricing" && <PricingView onExtend={showCerts} />}
        {view === "history" && (
          <PaymentHistory history={history} certs={certs} email={accountName} onBack={showCerts} />
        )}
        {view === "package" && currentCert && (
          <PackageSelect
            cert={currentCert}
            pkg={pkg}
            years={years}
            kind={draftCert ? "issue" : "extend"}
            onPkg={setPkg}
            onYears={setYears}
            onCancel={() => requestLeave(() => setView(draftCert ? "register" : "certs"))}
            onContinue={() => setView("billing")}
          />
        )}
        {view === "billing" && currentCert && (
          <BillingForm
            pkg={pkg}
            years={years}
            cert={currentCert}
            buyer={buyer}
            error={buyerErr}
            onChange={setBuyer}
            onBack={() => setView("package")}
            onSubmit={submitBuyer}
          />
        )}
        {view === "qr" && pay && order && (
          <PaymentStep qrUrl={qrUrl} pay={pay} order={order} ttl={ttl} onConfirm={simulatePay} />
        )}
        {view === "success" && invoice && (
          <PaymentSuccess invoice={invoice} email={accountName} order={order} onCerts={showCerts} />
        )}
        {view === "invoice" && invoice && (
          <InvoiceView invoice={invoice} email={accountName} onBack={showCerts} />
        )}
      </main>
      <div className={"toast" + (toastMsg ? " on" : "")} role="status">
        {toastMsg}
      </div>
      {leaveOpen ? (
        <div className="leave-overlay" role="dialog" aria-modal="true" aria-labelledby="leaveTitle">
          <div className="leave-dialog">
            <h2 id="leaveTitle">Leave payment?</h2>
            <p>Your payment is not finished. Leave this checkout, or continue paying?</p>
            <div className="leave-actions">
              <button className="btn btn-secondary" type="button" onClick={stayOnPayment}>
                Continue payment
              </button>
              <button className="btn btn-pay" type="button" onClick={leavePayment}>
                Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PortalChrome>
  );
}
