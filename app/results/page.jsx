'use client';

import { useEffect, useState } from 'react';
import MatchCard from '@/components/MatchCard';

export default function ResultsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/matches?status=FINISHED');
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const grouped = matches.reduce((acc, match) => {
    const date = match.utcDate.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <span className="trophy">🏆</span>
          <div>
            <h1 className="site-title">Results</h1>
            <p className="site-subtitle">World Cup 2026</p>
          </div>
        </div>
      </header>

      <div className="content">
        {loading && <p className="state-msg">Loading results…</p>}
        {error && <p className="state-msg error">Could not load results: {error}</p>}
        {!loading && !error && matches.length === 0 && (
          <p className="state-msg">No results yet — the tournament hasn't started!</p>
        )}
        {!loading && !error && Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, dayMatches]) => (
            <section key={date} className="day-group">
              <h2 className="day-label">
                {new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </h2>
              <div className="match-list">
                {dayMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}