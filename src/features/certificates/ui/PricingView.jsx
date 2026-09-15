export default function PricingView({ onExtend }) {
  return (
    <section className="view on">
      <h1 className="pricing-h1">Packages</h1>
      <p className="lede">
        Standard and Premium terms used when you extend a certificate’s validity. Prices include a 10% tax at checkout.
      </p>
      <div className="grid2">
        <article className="card">
          <h2 className="pricing-title">Standard</h2>
          <p className="meta">Core extension of validity age. Invoice export after payment.</p>
          <div className="price">
            120.000<span className="per">KIP / year</span>
          </div>
          <ul className="plist">
            <li>1 year · 120.000 KIP + tax (132.000 KIP total)</li>
            <li>2 years · 200.000 KIP + tax (220.000 KIP total)</li>
            <li>Dynamic QR checkout</li>
            <li>CA entitlement update after payment</li>
          </ul>
          <button className="btn-pill" type="button" onClick={onExtend}>
            Extend a certificate
          </button>
        </article>
        <article className="card soft">
          <h2 className="pricing-title">Premium</h2>
          <p className="meta">Priority CA fulfillment for the extension.</p>
          <div className="price">
            240.000<span className="per">KIP / year</span>
          </div>
          <ul className="plist">
            <li>1 year · 240.000 KIP + tax (264.000 KIP total)</li>
            <li>2 years · 400.000 KIP + tax (440.000 KIP total)</li>
            <li>Dynamic QR checkout</li>
            <li>Priority activation on the existing CA</li>
          </ul>
          <button className="btn-pill on" type="button" onClick={onExtend}>
            Extend a certificate
          </button>
        </article>
      </div>
    </section>
  );
}
