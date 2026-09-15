import { fmt } from "../../../shared/lib/format.js";
import { ageYears, isExpired, remaining, statusTag, validTo } from "../model/status.js";

export default function CertificateList({ certs, email, onReset, onExtend, onRegister }) {
  return (
    <section className="view on">
      <div className="page-head">
        <h1>Your certificates</h1>
        <div className="page-head-actions">
          {!certs.length ? (
            <button className="btn-link" type="button" onClick={onRegister}>
              Register certificate
            </button>
          ) : null}
          <button className="btn-link" type="button" onClick={onReset}>
            Clear data
          </button>
        </div>
      </div>
      <p className="lede">
        {certs.length
          ? "One certificate per account. Renew it when it expires."
          : "No certificates yet. Register a certificate to enroll owner and request details."}
      </p>
      <div className="list">
        {!certs.length ? (
          <p className="empty">
            <button className="btn btn-primary" type="button" onClick={onRegister}>
              Register certificate
            </button>
          </p>
        ) : null}
        {certs.map((c) => {
          const tag = statusTag(c);
          const expired = isExpired(c);
          return (
            <article className={"card" + (expired ? " expired" : "")} key={c.id}>
              <div className="card-head">
                <h2>{c.commonName}</h2>
                <span className={"tag " + tag.cls}>{tag.label}</span>
              </div>
              <p className="serial">{c.serial}</p>
              <div className={"age" + (expired ? " expired-band" : "")}>
                <p className="ok">{remaining(c)}</p>
                <p>
                  Validity age: <strong>{ageYears(c)} year(s)</strong> (issued {c.baseYears}, extended +
                  {c.extraYears || 0})
                </p>
                <p>
                  Valid {fmt(c.validFrom)} → {fmt(validTo(c))}
                </p>
              </div>
              <dl className="dl">
                <dt>Subscriber</dt>
                <dd>{email}</dd>
                <dt>Status</dt>
                <dd>{tag.status}</dd>
                <dt>Package</dt>
                <dd>{c.pkg}</dd>
                <dt>Issuer</dt>
                <dd>{c.issuer}</dd>
                <dt>Key usage</dt>
                <dd>{c.keyUsage}</dd>
                <dt>Issued</dt>
                <dd>{fmt(c.issuedAt)}</dd>
                <dt>Invoice</dt>
                <dd>{c.invoiceId}</dd>
                <dt>Payment reference</dt>
                <dd>{c.paymentRef}</dd>
              </dl>
              {expired && (
                <button className="btn btn-secondary" type="button" onClick={() => onExtend(c.id)}>
                  Renew expired certificate
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
