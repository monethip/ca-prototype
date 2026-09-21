import { fmt } from "../../../shared/lib/format";
import { downloadInvoiceHtml, invoiceFromHistory } from "../model/invoice";
import type { Certificate, PaymentHistoryRow } from "../../../types";

interface DownloadBtnProps {
  r: PaymentHistoryRow;
  certs: Certificate[];
  email: string;
}

function DownloadBtn({ r, certs, email }: DownloadBtnProps) {
  return (
    <button
      className="btn btn-secondary"
      type="button"
      onClick={() => downloadInvoiceHtml(invoiceFromHistory(r, certs, email), email)}
    >
      Download invoice
    </button>
  );
}

interface PaymentHistoryProps {
  history: PaymentHistoryRow[];
  certs: Certificate[];
  email: string;
  onBack: () => void;
}

export default function PaymentHistory({ history, certs, email, onBack }: PaymentHistoryProps) {
  return (
    <section className="view on">
      <h1>Payment history</h1>
      <p className="lede">Payments for this login, including the original issue invoice and new extensions.</p>
      {!history.length ? (
        <p className="empty">No paid orders yet.</p>
      ) : (
        <>
          <div className="hist-scroll desktop-only">
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Paid</th>
                  <th>Type</th>
                  <th>Certificate</th>
                  <th>Invoice</th>
                  <th>Package</th>
                  <th>Total</th>
                  <th>PSP ref</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.invoiceId}>
                    <td>{fmt(r.paidAt)}</td>
                    <td>{r.kind === "extend" ? "Extension" : "Issue"}</td>
                    <td>{r.commonName || "—"}</td>
                    <td>{r.invoiceId}</td>
                    <td>
                      {r.pkg} · {r.years} yr
                    </td>
                    <td>{Number(r.total).toFixed(2)} KIP</td>
                    <td>{r.paymentRef}</td>
                    <td>{r.certSerial ? "Activated · " + r.certSerial : r.status}</td>
                    <td>
                      <DownloadBtn r={r} certs={certs} email={email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hist-cards mobile-only">
            {history.map((r) => (
              <article className="hist-card" key={r.invoiceId}>
                <div className="hist-card-head">
                  <strong>{r.invoiceId}</strong>
                  <span>{r.kind === "extend" ? "Extension" : "Issue"}</span>
                </div>
                <dl>
                  <div>
                    <dt>Paid</dt>
                    <dd>{fmt(r.paidAt)}</dd>
                  </div>
                  <div>
                    <dt>Certificate</dt>
                    <dd>{r.commonName || "—"}</dd>
                  </div>
                  <div>
                    <dt>Package</dt>
                    <dd>
                      {r.pkg} · {r.years} yr
                    </dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{Number(r.total).toFixed(2)} KIP</dd>
                  </div>
                  <div>
                    <dt>PSP ref</dt>
                    <dd>{r.paymentRef}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{r.certSerial ? "Activated · " + r.certSerial : r.status}</dd>
                  </div>
                </dl>
                <DownloadBtn r={r} certs={certs} email={email} />
              </article>
            ))}
          </div>
        </>
      )}
      <div className="actions">
        <button className="btn btn-secondary" type="button" onClick={onBack}>
          Back to certificates
        </button>
      </div>
    </section>
  );
}
