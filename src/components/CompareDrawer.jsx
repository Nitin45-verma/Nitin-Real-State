import { motion, AnimatePresence } from 'framer-motion';

const formatINR = (val) => {
  if (!val && val !== 0) return '—';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const COMPARE_FIELDS = [
  { key: 'price',    label: 'Price',           render: (p) => formatINR(p.price) },
  { key: 'type',     label: 'Type',            render: (p) => p.type || '—' },
  { key: 'location', label: 'Location',        render: (p) => p.location || '—' },
  { key: 'bhk',      label: 'BHK',             render: (p) => p.bhk ? `${p.bhk} BHK` : '—' },
  { key: 'area',     label: 'Area (sq.ft)',     render: (p) => p.area ? `${p.area.toLocaleString()} sq.ft` : '—' },
  { key: 'pricePerSqft', label: 'Price / sq.ft',render: (p) => (p.price && p.area) ? formatINR(Math.round(p.price / p.area)) : '—' },
  { key: 'floor',    label: 'Floor',           render: (p) => p.floor ?? '—' },
  { key: 'parking',  label: 'Parking',         render: (p) => p.parking !== undefined ? (p.parking ? '✅ Yes' : '❌ No') : '—' },
  { key: 'maintenance', label: 'Maintenance',  render: (p) => p.maintenance ? `₹${p.maintenance}/mo` : '—' },
  { key: 'isApproved', label: 'Verified',      render: (p) => p.isApproved ? '✅ Verified' : '⏳ Pending' },
];

const CompareDrawer = ({ compareList, properties, onRemove, onClear }) => {
  const selected = properties.filter((p) => compareList.includes(p._id));
  const count = selected.length;

  if (count === 0) return null;

  return (
    <>
      {/* Sticky Bar */}
      <motion.div
        className="compare-sticky-bar"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 240 }}
      >
        <div className="compare-sticky-inner">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="compare-count-badge">
              <i className="bi bi-ui-checks-grid me-1"></i>
              {count} / 3 Selected
            </span>
            {selected.map((p) => (
              <span key={p._id} className="compare-chip">
                {p.title}
                <button
                  className="compare-chip-remove"
                  onClick={() => onRemove(p._id)}
                  aria-label={`Remove ${p.title} from comparison`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="d-flex gap-2 align-items-center">
            <button className="btn compare-clear-btn" onClick={onClear}>
              <i className="bi bi-x-circle me-1"></i>Clear
            </button>
            <button
              className="btn compare-now-btn"
              disabled={count < 2}
              data-bs-toggle="modal"
              data-bs-target="#compareModal"
              id="compare-now-btn"
            >
              <i className="bi bi-layout-split me-1"></i>Compare Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="compareModal"
        tabIndex="-1"
        aria-labelledby="compareModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content compare-modal-content">
            <div className="modal-header compare-modal-header">
              <h5 className="modal-title" id="compareModalLabel">
                <i className="bi bi-layout-split me-2" style={{ color: 'var(--accent-color)' }}></i>
                Property Comparison
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body p-0">
              <div className="compare-table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th className="compare-th-label">Feature</th>
                      {selected.map((p) => (
                        <th key={p._id} className="compare-th-property">
                          <div className="compare-prop-header">
                            <div className="compare-prop-title">{p.title}</div>
                            <div className="compare-prop-loc">
                              <i className="bi bi-geo-alt-fill me-1"></i>{p.location}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_FIELDS.map((field, rowIdx) => (
                      <tr key={field.key} className={rowIdx % 2 === 0 ? 'compare-row-even' : 'compare-row-odd'}>
                        <td className="compare-field-label">{field.label}</td>
                        {selected.map((p) => (
                          <td key={p._id} className="compare-field-value">
                            {field.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer compare-modal-footer">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                "—" indicates data not available for this listing.
              </small>
              <button type="button" className="btn compare-close-btn" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareDrawer;
