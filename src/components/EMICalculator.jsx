import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatINR = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const computeEMI = (principal, annualRate, tenureYears) => {
  if (!principal || !annualRate || !tenureYears) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) {
    const emi = principal / n;
    return { emi, totalInterest: 0, totalAmount: principal };
  }
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;
  return { emi, totalInterest, totalAmount };
};

const SliderField = ({ label, min, max, step, value, onChange, display }) => (
  <div className="emi-slider-field">
    <div className="d-flex justify-content-between align-items-center mb-1">
      <label className="emi-slider-label">{label}</label>
      <span className="emi-slider-value">{display}</span>
    </div>
    <input
      type="range"
      className="emi-range-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <div className="d-flex justify-content-between">
      <small className="text-muted">{typeof min === 'number' && min >= 100000 ? formatINR(min) : min}</small>
      <small className="text-muted">{typeof max === 'number' && max >= 100000 ? formatINR(max) : max}</small>
    </div>
  </div>
);

const EMICalculator = () => {
  const [open, setOpen] = useState(false);
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(15);
  const [rate, setRate] = useState(8.5);

  const loanAmount = propertyPrice * (1 - downPct / 100);
  const { emi, totalInterest } = computeEMI(loanAmount, rate, tenure);
  const minIncome = emi / 0.4; // EMI assumed to be 40% of income

  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <>
      {/* FAB Button */}
      <motion.button
        className="emi-fab"
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="EMI & Affordability Calculator"
        aria-label="Open EMI Calculator"
        id="emi-calculator-fab"
      >
        <i className="bi bi-calculator-fill fs-4"></i>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="emi-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              className="emi-modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            >
              {/* Header */}
              <div className="emi-modal-header">
                <div>
                  <h4 className="mb-0">
                    <i className="bi bi-calculator me-2" style={{ color: 'var(--accent-color)' }}></i>
                    EMI & Affordability
                  </h4>
                  <p className="text-muted small mb-0 mt-1">Drag sliders for instant results</p>
                </div>
                <button className="btn-close btn-close-white" onClick={() => setOpen(false)} />
              </div>

              <div className="emi-modal-body">
                {/* Sliders */}
                <div className="emi-sliders-col">
                  <SliderField
                    label="Property Price"
                    min={1000000} max={100000000} step={500000}
                    value={propertyPrice}
                    onChange={setPropertyPrice}
                    display={formatINR(propertyPrice)}
                  />
                  <SliderField
                    label="Down Payment"
                    min={5} max={50} step={1}
                    value={downPct}
                    onChange={setDownPct}
                    display={`${downPct}%  (${formatINR(propertyPrice * downPct / 100)})`}
                  />
                  <SliderField
                    label="Loan Tenure"
                    min={1} max={30} step={1}
                    value={tenure}
                    onChange={setTenure}
                    display={`${tenure} yr${tenure > 1 ? 's' : ''}`}
                  />
                  <SliderField
                    label="Interest Rate"
                    min={5} max={15} step={0.1}
                    value={rate}
                    onChange={setRate}
                    display={`${rate.toFixed(1)}% p.a.`}
                  />

                  <div className="emi-loan-summary mt-3">
                    <span className="text-muted small">Loan Amount</span>
                    <span className="fw-bold" style={{ color: 'var(--accent-color)' }}>{formatINR(loanAmount)}</span>
                  </div>
                </div>

                {/* Results */}
                <div className="emi-results-col">
                  <div className="emi-metric-card emi-metric-primary">
                    <div className="emi-metric-icon"><i className="bi bi-calendar-month-fill"></i></div>
                    <div className="emi-metric-label">Monthly EMI</div>
                    <div className="emi-metric-value">{formatINR(Math.round(emi))}</div>
                  </div>

                  <div className="emi-metric-card emi-metric-secondary">
                    <div className="emi-metric-icon"><i className="bi bi-graph-up-arrow"></i></div>
                    <div className="emi-metric-label">Total Interest Payable</div>
                    <div className="emi-metric-value">{formatINR(Math.round(totalInterest))}</div>
                  </div>

                  <div className="emi-metric-card emi-metric-tertiary">
                    <div className="emi-metric-icon"><i className="bi bi-person-check-fill"></i></div>
                    <div className="emi-metric-label">Min. Monthly Income</div>
                    <div className="emi-metric-value">{formatINR(Math.round(minIncome))}</div>
                    <div className="emi-metric-note">Based on 40% EMI-to-income ratio</div>
                  </div>

                  <div className="emi-metric-card emi-metric-dark">
                    <div className="emi-metric-icon"><i className="bi bi-bank2"></i></div>
                    <div className="emi-metric-label">Total Repayment</div>
                    <div className="emi-metric-value">{formatINR(Math.round(emi * tenure * 12))}</div>
                  </div>
                </div>
              </div>

              <div className="emi-modal-footer">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Figures are indicative. Actual rates may vary by lender.
                </small>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EMICalculator;
