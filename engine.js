/* Runoff engine - instant-runoff (ranked-choice) tallying, pure functions.
   The problem: group decisions die in 40-message threads. Everyone ranks the
   options once; the runoff finds the option the group can actually live with. */
(function (global) {
  'use strict';

  // options: [id,...]; ballots: [[rankedId1, rankedId2, ...], ...] (partial ok)
  // Returns { winner, rounds: [{counts: {id: n}, eliminated: [ids], majority}], exhausted }
  function tally(options, ballots) {
    if (!options.length) throw new Error('no options');
    var active = options.slice();
    var rounds = [];

    function firstChoice(ballot) {
      for (var i = 0; i < ballot.length; i++) {
        if (active.indexOf(ballot[i]) >= 0) return ballot[i];
      }
      return null; // exhausted
    }

    while (true) {
      var counts = {};
      active.forEach(function (o) { counts[o] = 0; });
      var live = 0;
      ballots.forEach(function (b) {
        var c = firstChoice(b);
        if (c !== null) { counts[c]++; live++; }
      });

      if (live === 0) {
        return { winner: null, rounds: rounds, exhausted: ballots.length };
      }

      // majority of still-live ballots wins
      for (var k in counts) {
        if (counts[k] > live / 2) {
          rounds.push({ counts: counts, eliminated: [], majority: true });
          return { winner: k, rounds: rounds, exhausted: ballots.length - live };
        }
      }

      // eliminate all options tied for fewest votes
      var min = Math.min.apply(null, active.map(function (o) { return counts[o]; }));
      var doomed = active.filter(function (o) { return counts[o] === min; });
      rounds.push({ counts: counts, eliminated: doomed, majority: false });

      active = active.filter(function (o) { return doomed.indexOf(o) < 0; });

      // if elimination wiped everyone, it's a dead tie among the doomed
      if (!active.length) {
        return { winner: null, tieAmong: doomed.slice(), rounds: rounds, exhausted: ballots.length - live };
      }
    }
  }

  var api = { tally: tally };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Runoff = api;
})(typeof window !== 'undefined' ? window : globalThis);
