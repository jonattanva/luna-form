window.BENCHMARK_DATA = {
  "lastUpdate": 1771702806621,
  "repoUrl": "https://github.com/jonattanva/luna-form",
  "entries": {
    "Luna Form core benchmarks": [
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "feb438d103018a0ec27381365f33a7da4a636fbc",
          "message": "fix: use saved SHA to restore HEAD after creating gh-pages branch\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-21T14:39:39-05:00",
          "tree_id": "39f519d6a60ec55122e31891886966179e992ea5",
          "url": "https://github.com/jonattanva/luna-form/commit/feb438d103018a0ec27381365f33a7da4a636fbc"
        },
        "date": 1771702805799,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0019747859999999944,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.002589242000000013,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.039476338000000055,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003739819999999554,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0011985919999999623,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04399207799999999,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}