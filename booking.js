// ============================================================
// booking.js — Time slot picker & form logic
//
// To configure your available times, edit AVAILABLE_SLOTS below.
// Keys are dates in YYYY-MM-DD format (ET timezone).
// Values are arrays of time strings shown on the buttons.
//
// Form submissions go to Formspree.
// Replace YOUR_FORMSPREE_ID in index.html with your real form ID.
// Sign up free at https://formspree.io
// ============================================================

const AVAILABLE_SLOTS = {
  '2026-03-17': ['9:00 AM', '10:00 AM', '2:00 PM', '3:30 PM'],
  '2026-03-18': ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
  '2026-03-19': ['10:00 AM', '11:00 AM', '3:00 PM'],
  '2026-03-23': ['9:00 AM', '10:30 AM', '2:00 PM', '3:00 PM'],
  '2026-03-24': ['9:00 AM', '11:00 AM', '4:00 PM'],
  '2026-03-25': ['10:00 AM', '1:00 PM', '2:30 PM'],
  '2026-03-26': ['9:00 AM', '10:00 AM', '3:00 PM'],
  '2026-03-27': ['11:00 AM', '1:00 PM'],
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let selectedSlot = null;

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[m - 1]} ${d}`;
}

function getWeekLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);
  if (diffDays <= 6) return 'This week';
  if (diffDays <= 13) return 'Next week';
  return `Week of ${MONTH_NAMES[m - 1]} ${d}`;
}

function renderSlots() {
  const grid = document.getElementById('slot-grid');
  if (!grid) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter out past dates
  const futureDates = Object.keys(AVAILABLE_SLOTS).filter(dateStr => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d) >= today;
  }).sort();

  if (futureDates.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:24px 0;">No upcoming slots available. Please check back soon.</p>';
    return;
  }

  // Group by week label
  const weeks = {};
  futureDates.forEach(dateStr => {
    const label = getWeekLabel(dateStr);
    if (!weeks[label]) weeks[label] = [];
    weeks[label].push(dateStr);
  });

  let html = '';
  Object.entries(weeks).forEach(([weekLabel, dates]) => {
    html += `<div class="slot-week">`;
    html += `<div class="slot-week-label">${weekLabel}</div>`;
    dates.forEach(dateStr => {
      const times = AVAILABLE_SLOTS[dateStr];
      html += `<div class="slot-day">`;
      html += `<div class="slot-day-label">${formatDateLabel(dateStr)}</div>`;
      html += `<div class="slot-times">`;
      times.forEach(time => {
        const slotId = `${dateStr}|${time}`;
        html += `<button class="slot-btn" data-slot="${slotId}" data-label="${formatDateLabel(dateStr)} at ${time} ET">${time}</button>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;
  });

  grid.innerHTML = html;

  // Attach click handlers
  grid.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => selectSlot(btn));
  });
}

function selectSlot(btn) {
  // Deselect previous
  document.querySelectorAll('.slot-btn.selected').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  selectedSlot = {
    id: btn.dataset.slot,
    label: btn.dataset.label,
  };

  // Advance to step 2 after short delay for visual feedback
  setTimeout(() => goToStep(2), 180);
}

function goToStep(step) {
  [1, 2, 3].forEach(n => {
    document.getElementById(`step-${n}`).classList.toggle('hidden', n !== step);
    const indicator = document.getElementById(`step-indicator-${n}`);
    indicator.classList.toggle('active', n === step);
    indicator.classList.toggle('done', n < step);
  });

  if (step === 2 && selectedSlot) {
    document.getElementById('hidden-slot').value = selectedSlot.label;
    document.getElementById('selected-slot-banner').textContent = `📅 ${selectedSlot.label}`;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        document.getElementById('confirmed-slot-card').textContent = `📅 ${selectedSlot ? selectedSlot.label : ''}`;
        goToStep(3);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking →';
        alert('Something went wrong. Please email davidedgarmerkel@gmail.com directly.');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Booking →';
      alert('Network error. Please email davidedgarmerkel@gmail.com directly.');
    }
  });

  document.getElementById('back-btn').addEventListener('click', () => goToStep(1));
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderSlots();
  initBookingForm();
});
