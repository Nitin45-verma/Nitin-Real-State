import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SLOTS = ['Morning', 'Evening'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const toLocalISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const VisitBookingModal = ({ isOpen, onClose, property }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);

  const calNavPrev = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const calNavNext = () => {
    const nextMonth = calMonth === 11 ? 0 : calMonth + 1;
    const nextYear = calMonth === 11 ? calYear + 1 : calYear;
    const firstOfNext = new Date(nextYear, nextMonth, 1);
    if (firstOfNext <= maxDate) {
      if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
      else setCalMonth(m => m + 1);
    }
  };

  const canGoPrev = useMemo(() => {
    return calYear > today.getFullYear() || calMonth > today.getMonth();
  }, [calYear, calMonth, today]);

  const canGoNext = useMemo(() => {
    const nextMonthFirst = new Date(calYear, calMonth + 1, 1);
    return nextMonthFirst <= maxDate;
  }, [calYear, calMonth, maxDate]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const isDayDisabled = (day) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const handleDayClick = (day) => {
    if (isDayDisabled(day)) return;
    const d = new Date(calYear, calMonth, day);
    setSelectedDate(d);
    setSelectedSlot(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) { setErrorMsg('Please select a date.'); return; }
    if (!selectedSlot) { setErrorMsg('Please choose a slot (Morning or Evening).'); return; }
    if (!buyerName.trim()) { setErrorMsg('Please enter your name.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setErrorMsg('Please enter a valid 10-digit Indian mobile number.'); return; }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await axios.post('/api/bookings', {
        buyerName: buyerName.trim(),
        phone: phone.trim(),
        propertyId: property._id,
        propertyTitle: property.title,
        date: toLocalISO(selectedDate),
        slot: selectedSlot,
      });
      setSuccessMsg(`🎉 Visit booked! Our team will contact you to confirm your ${selectedSlot} visit on ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}.`);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setBuyerName('');
    setPhone('');
    setSuccessMsg('');
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="vb-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <motion.div
          className="vb-modal"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        >
          {/* Header */}
          <div className="vb-header">
            <div>
              <h4 className="mb-0">
                <i className="bi bi-calendar2-check me-2" style={{ color: 'var(--accent-color)' }}></i>
                Schedule a Visit
              </h4>
              {property && (
                <p className="vb-property-name">{property.title} — {property.location}</p>
              )}
            </div>
            <button className="btn-close btn-close-white" onClick={handleClose} />
          </div>

          <div className="vb-body">
            {successMsg ? (
              <motion.div
                className="vb-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="vb-success-icon">✅</div>
                <p>{successMsg}</p>
                <button className="btn vb-done-btn" onClick={handleClose}>Done</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Calendar */}
                <div className="vb-section-label">
                  <i className="bi bi-calendar3 me-1"></i> Select Date
                </div>

                <div className="vb-calendar">
                  <div className="vb-cal-nav">
                    <button
                      type="button"
                      className="vb-cal-arrow"
                      onClick={calNavPrev}
                      disabled={!canGoPrev}
                    >‹</button>
                    <span className="vb-cal-month-label">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </span>
                    <button
                      type="button"
                      className="vb-cal-arrow"
                      onClick={calNavNext}
                      disabled={!canGoNext}
                    >›</button>
                  </div>

                  <div className="vb-cal-grid">
                    {DAY_LABELS.map(d => (
                      <div key={d} className="vb-cal-day-label">{d}</div>
                    ))}
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const d = new Date(calYear, calMonth, day);
                      const isSelected = selectedDate && toLocalISO(d) === toLocalISO(selectedDate);
                      const isDisabled = isDayDisabled(day);
                      const isToday = toLocalISO(d) === toLocalISO(today);
                      return (
                        <button
                          key={day}
                          type="button"
                          className={[
                            'vb-cal-day',
                            isSelected ? 'vb-cal-day--selected' : '',
                            isDisabled ? 'vb-cal-day--disabled' : '',
                            isToday && !isSelected ? 'vb-cal-day--today' : '',
                          ].join(' ')}
                          onClick={() => handleDayClick(day)}
                          disabled={isDisabled}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slot picker */}
                <div className="vb-section-label mt-3">
                  <i className="bi bi-clock me-1"></i> Choose Time Slot
                </div>
                <div className="vb-slot-group">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`vb-slot-btn ${selectedSlot === slot ? 'vb-slot-btn--active' : ''}`}
                      onClick={() => { setSelectedSlot(slot); setErrorMsg(''); }}
                    >
                      <i className={`bi ${slot === 'Morning' ? 'bi-sunrise' : 'bi-sunset'} me-2`}></i>
                      {slot}
                      <small className="d-block vb-slot-time">
                        {slot === 'Morning' ? '9 AM – 12 PM' : '3 PM – 6 PM'}
                      </small>
                    </button>
                  ))}
                </div>

                {/* Buyer Info */}
                <div className="vb-section-label mt-3">
                  <i className="bi bi-person me-1"></i> Your Details
                </div>
                <div className="vb-form-grid">
                  <div className="vb-form-group">
                    <label className="vb-form-label">Full Name</label>
                    <input
                      className="vb-form-input"
                      type="text"
                      placeholder="Enter your name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="vb-form-group">
                    <label className="vb-form-label">Phone Number</label>
                    <input
                      className="vb-form-input"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="vb-error-msg">
                    <i className="bi bi-exclamation-triangle me-1"></i>{errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn vb-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Booking...</>
                  ) : (
                    <><i className="bi bi-calendar-check me-2"></i>Confirm Visit</>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitBookingModal;
