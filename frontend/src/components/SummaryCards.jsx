import React from 'react';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const SummaryCards = ({ summary, monthlyTotal, leadsByPlatform = {} }) => {
  const cards = [
    {
      label: 'Total Investment',
      value: summary.total,
      accent: 'total',
      leads: leadsByPlatform.total
    },
    {
      label: 'Instagram Investment',
      value: summary.instagram,
      accent: 'instagram',
      leads: leadsByPlatform.instagram
    },
    {
      label: 'Facebook Investment',
      value: summary.facebook,
      accent: 'facebook',
      leads: leadsByPlatform.facebook
    },
    {
      label: 'LinkedIn Investment',
      value: summary.linkedin,
      accent: 'linkedin',
      leads: leadsByPlatform.linkedin
    },
    {
      label: 'Other Investment',
      value: summary.other,
      accent: 'other',
      leads: leadsByPlatform.other
    }
  ];

  return (
    <div className="summary-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Summary Cards</p>
          <h2>Platform-wise spending snapshot</h2>
        </div>
        <div className="summary-highlight">
          <span>This Month</span>
          <strong>{currency.format(monthlyTotal)}</strong>
        </div>
      </div>

      <div className="summary-grid">
        {cards.map((card) => (
          <article key={card.label} className={`summary-card summary-card-${card.accent}`}>
            <p>{card.label}</p>
            <strong>{currency.format(card.value || 0)}</strong>
            <span className="summary-card-meta">{card.leads || 0} leads</span>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
