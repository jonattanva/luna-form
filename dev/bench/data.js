window.BENCHMARK_DATA = {
  "lastUpdate": 1779319309399,
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
      },
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
          "id": "b8e02e2e450e7d316bf2fb2b0f0aa0ce52235d44",
          "message": "Upgrade...",
          "timestamp": "2026-02-21T15:03:49-05:00",
          "tree_id": "bd572ea5844a177a621103185033be594159117f",
          "url": "https://github.com/jonattanva/luna-form/commit/b8e02e2e450e7d316bf2fb2b0f0aa0ce52235d44"
        },
        "date": 1771704255963,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0016844800000000077,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.002565686000000028,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.038524978000000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003719740000000229,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0012256660000000467,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04400848600000006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "28807dc92ecc0836a8eba86604ef0f694a5d2ad7",
          "message": "test(e2e): fix ambiguous getByText selector in translation spec",
          "timestamp": "2026-02-21T15:46:02-05:00",
          "tree_id": "058e053a4fc5402e523ac969d76dd5e7b41fb34f",
          "url": "https://github.com/jonattanva/luna-form/commit/28807dc92ecc0836a8eba86604ef0f694a5d2ad7"
        },
        "date": 1771706787050,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0013451659999999493,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.002339960000000019,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03930127200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003899059999999963,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0011585599999999658,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03767789000000005,
            "unit": "ms"
          }
        ]
      },
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
          "id": "e81df8896f57b3ef7f0fcd4e8e381102a5e7c5d9",
          "message": "chore: apply pre-existing pending changes\n\n- Remove dark:bg-input/30 from input, select, and textarea UI components\n- Add HIDDEN and TYPE constants to constant.ts\n- Minor formatting cleanup in field-with-state.tsx\n- Add ml-1.5 to advanced field set content border\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-22T21:22:18-05:00",
          "tree_id": "ac1403b655366d6772fc1277e8e8170712f12e20",
          "url": "https://github.com/jonattanva/luna-form/commit/e81df8896f57b3ef7f0fcd4e8e381102a5e7c5d9"
        },
        "date": 1771813384627,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023278460000000223,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034140859999999976,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04055979999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010135820000000421,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0023613880000000337,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.045050527999999986,
            "unit": "ms"
          }
        ]
      },
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
          "id": "99dd6a17b3500a3c32955cc65fb3e7e31353f438",
          "message": "test(e2e): fix strict mode violation by using exact text match for section titles",
          "timestamp": "2026-02-22T22:22:30-05:00",
          "tree_id": "8e90d231748d0957ac65b1506850624dea7f8403",
          "url": "https://github.com/jonattanva/luna-form/commit/99dd6a17b3500a3c32955cc65fb3e7e31353f438"
        },
        "date": 1771816975393,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.003201850000000036,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.005543316000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.050066599999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001293292000000065,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0014654740000000857,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.06815258000000006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c05e3a70d29ca1e34ee0d806f44330d75c472a24",
          "message": "remove unnecessary code",
          "timestamp": "2026-02-22T22:34:49-05:00",
          "tree_id": "71bf3ec3d9ac197827d18b054d8c91f984ef5a2d",
          "url": "https://github.com/jonattanva/luna-form/commit/c05e3a70d29ca1e34ee0d806f44330d75c472a24"
        },
        "date": 1771817731679,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0021895779999999833,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003294264000000112,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04170833000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013444320000000972,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0020661079999999858,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04467815400000006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "59b2e286e9ca21a2e3805a19b1f8ba46ca655b20",
          "message": "refactor: rename guard components and extract list slot\n\n- Rename GuardWithSection to VisibilityGuard and GuardWithList to\n  ListGuard, following the XGuard naming pattern\n- Inline guard.ts helpers into visibility-guard.tsx and remove the file\n- Extract ListSlot from slot.tsx into its own list-slot.tsx\n- Fix ListGuard to use the client-side FieldList (with add button and\n  useFieldList hook) instead of the server-side version\n- Add list-visibility e2e tests and list-guard unit tests\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-23T16:57:26-05:00",
          "tree_id": "1bde4de6277b69b89bd93679347ac87eff4c4456",
          "url": "https://github.com/jonattanva/luna-form/commit/59b2e286e9ca21a2e3805a19b1f8ba46ca655b20"
        },
        "date": 1771883907113,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002265288000000055,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033443599999999378,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04075675000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010049559999999928,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0017590820000000348,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03913678399999992,
            "unit": "ms"
          }
        ]
      },
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
          "id": "01727c238406fcf17ec44deeea8328380e39aa74",
          "message": "New examples...",
          "timestamp": "2026-02-24T15:28:10-05:00",
          "tree_id": "5318aa16bdd15d3e405fe8a2965d50d7e161f48b",
          "url": "https://github.com/jonattanva/luna-form/commit/01727c238406fcf17ec44deeea8328380e39aa74"
        },
        "date": 1771964916208,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.003045378000000028,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.005868561999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04877463799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0025868040000000293,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0028161499999999934,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.047894817999999985,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c6a2b7b2d878a71b5a39cc19d318dcc3e9f6114a",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T16:03:33-05:00",
          "tree_id": "ae69fd6d96edb33763c465d96dbe7b06ab5ea1ce",
          "url": "https://github.com/jonattanva/luna-form/commit/c6a2b7b2d878a71b5a39cc19d318dcc3e9f6114a"
        },
        "date": 1771967044615,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002328497999999968,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003733757999999966,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0435712420000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011060420000000022,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002287119999999959,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.05421152200000006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "140c08b71aefa1090d1880fd4b8efb5380c3d0ce",
          "message": "refactor(input): simplify useEffect guards and remove unused dep\n\n- Combine options-not-ready and invalid-default guards into a single isReady variable\n- Remove hasClickable from useEffect dependency array (not referenced in the effect)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T17:02:45-05:00",
          "tree_id": "362c29acbbbdd78416ca4b6763affe4acfa505db",
          "url": "https://github.com/jonattanva/luna-form/commit/140c08b71aefa1090d1880fd4b8efb5380c3d0ce"
        },
        "date": 1771970609492,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0021102300000000016,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033856960000000526,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04753189599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0017890879999999925,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0019136600000000498,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04229184999999996,
            "unit": "ms"
          }
        ]
      },
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
          "id": "43dfebeec02a4f610ef2f9cc07c83a8e49efca52",
          "message": "new version",
          "timestamp": "2026-02-24T17:03:06-05:00",
          "tree_id": "8ffe29f2527753876c6d2bb8439fd3f898e836b9",
          "url": "https://github.com/jonattanva/luna-form/commit/43dfebeec02a4f610ef2f9cc07c83a8e49efca52"
        },
        "date": 1771970630415,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0020664259999999784,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003308821999999964,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04096855599999992,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010170520000000352,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002350595999999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04112097800000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "abcc4800e96e382bcbbdf037f18684b42e1de451",
          "message": "fix(string): bound markdown link regex quantifiers to prevent ReDoS\n\nAdds length limits to the REGEX_MARKDOWN_LINK quantifiers ({1,500} for\nlink text, {1,2000} for URL) to cap backtracking and eliminate O(n^2)\ncomplexity on adversarial inputs.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T21:47:34-05:00",
          "tree_id": "553cfe688964b8824f181daa81daf061f3882bc4",
          "url": "https://github.com/jonattanva/luna-form/commit/abcc4800e96e382bcbbdf037f18684b42e1de451"
        },
        "date": 1771987712746,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002356133999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003493754000000081,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041597630000000094,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013452080000000706,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001640739999999937,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04457237800000007,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bf15cf9ea53eb5d7320cbe551aa4ac9e279fdd18",
          "message": "fix(util): prevent ReDoS in interpolation and type extraction regexes\n\nBounds placeholder regex quantifiers to {1,200} in isInterpolated and\nreplacePlaceholders to cap backtracking. Replaces REGEX_TYPE with\nlastIndexOf to eliminate the regex entirely from getType.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T21:54:54-05:00",
          "tree_id": "ef5fe3efcd5b163c3ec7519723e4babbeebcfd77",
          "url": "https://github.com/jonattanva/luna-form/commit/bf15cf9ea53eb5d7320cbe551aa4ac9e279fdd18"
        },
        "date": 1771988138152,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023121280000000296,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034579459999999926,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.039205512,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010737719999999627,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002699167999999986,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04059367199999997,
            "unit": "ms"
          }
        ]
      },
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
          "id": "18656f59f8bca6581d2204e16bfdc1696c5c9c82",
          "message": "fix(ci): restrict GITHUB_TOKEN to minimum required permissions\n\nAdds a workflow-level permissions block with contents: read to follow\nthe principle of least privilege.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T21:58:41-05:00",
          "tree_id": "522ff2c873cfb7b018e8a8c349943ffa76a455a6",
          "url": "https://github.com/jonattanva/luna-form/commit/18656f59f8bca6581d2204e16bfdc1696c5c9c82"
        },
        "date": 1771988347885,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025612139999999497,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0037832319999999984,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0410960960000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001009461999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0025570060000000014,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04283868600000005,
            "unit": "ms"
          }
        ]
      },
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
          "id": "9ef22e2cc3e04685ef73dbf773e1d2d4c2879109",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T22:01:10-05:00",
          "tree_id": "d5b4e3f47f67e48d29bcaf9b23b0020f20f0d8d7",
          "url": "https://github.com/jonattanva/luna-form/commit/9ef22e2cc3e04685ef73dbf773e1d2d4c2879109"
        },
        "date": 1771988516637,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002259525999999937,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003454560000000015,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04103805999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010311479999999165,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002402492000000052,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04138342599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "4ca2fb6e76bffacf81bf524abbfb7269aff4cef4",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T22:08:34-05:00",
          "tree_id": "f135f34bd4bf40f47c10ebeebbd1b0684ce9c4a3",
          "url": "https://github.com/jonattanva/luna-form/commit/4ca2fb6e76bffacf81bf524abbfb7269aff4cef4"
        },
        "date": 1771988938539,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025671700000000327,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036277099999999793,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04020511600000009,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010816499999999679,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0017278639999999542,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04299924799999997,
            "unit": "ms"
          }
        ]
      },
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
          "id": "9faa801d3d4c71fe2d2af720ad6ad7016f4f760b",
          "message": "fix field description",
          "timestamp": "2026-02-27T11:53:51-05:00",
          "tree_id": "3afcb56bb70a09b322b43b89ea0baa58f02ec19c",
          "url": "https://github.com/jonattanva/luna-form/commit/9faa801d3d4c71fe2d2af720ad6ad7016f4f760b"
        },
        "date": 1772211278916,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023104119999999852,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003614882000000023,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04330318599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010724159999999756,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001507251999999994,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.046348131999999966,
            "unit": "ms"
          }
        ]
      },
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
          "id": "97321f5c8c41bfd74bf7d766d364a3d8f0116835",
          "message": "fix error",
          "timestamp": "2026-03-01T22:32:43-05:00",
          "tree_id": "d7a848131845a5736950ab61846346c98f1d0d11",
          "url": "https://github.com/jonattanva/luna-form/commit/97321f5c8c41bfd74bf7d766d364a3d8f0116835"
        },
        "date": 1772422411361,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0021684000000000195,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003476448000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04160376999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0012928799999999683,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001620012000000088,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04448622599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "e28335eeaf8471672400de379507f787d48024ff",
          "message": "refactor: simplify orientation logic to use boolean horizontal property",
          "timestamp": "2026-03-09T20:06:17-05:00",
          "tree_id": "071df2f9ec55d195e3b95d32a1d9d068b731f3ab",
          "url": "https://github.com/jonattanva/luna-form/commit/e28335eeaf8471672400de379507f787d48024ff"
        },
        "date": 1773104826221,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002681359999999927,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036901339999999435,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041171723999999923,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0012872319999999036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002217118000000028,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.045420096000000056,
            "unit": "ms"
          }
        ]
      },
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
          "id": "61fd3ffee0d7c31ae414046f821a1c810558dc19",
          "message": "chore: set rootDir in packages/luna-core/tsconfig.json",
          "timestamp": "2026-04-06T18:08:10-05:00",
          "tree_id": "c4e3176a114b449c498d6d719eb7572022baf544",
          "url": "https://github.com/jonattanva/luna-form/commit/61fd3ffee0d7c31ae414046f821a1c810558dc19"
        },
        "date": 1775516936804,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0033473340000000464,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0037737580000000433,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04245079399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001240032000000042,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0018676920000000336,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04531880799999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c0ffa2e9bfbdf4b0c634adfaba52a39fdc464a6f",
          "message": "chore: updates and fixes",
          "timestamp": "2026-04-06T18:14:47-05:00",
          "tree_id": "cd861a58c51a7c14d8a25b1cfa1686f755e972bd",
          "url": "https://github.com/jonattanva/luna-form/commit/c0ffa2e9bfbdf4b0c634adfaba52a39fdc464a6f"
        },
        "date": 1775517328650,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002279993999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003654508000000078,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040507764000000064,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010156880000000684,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002246811999999977,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.042055740000000015,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ae711b575565958d5409455f82716bd04166b7f5",
          "message": "fix(luna-svelte): replace Orientation type with horizontal boolean\n\nRemoves the removed Orientation type and HORIZONTAL/VERTICAL constants\nfrom luna-core imports, aligning luna-svelte with the orientation refactor.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-06T18:33:00-05:00",
          "tree_id": "7ad2424e138edb448814b2a6981cfaee60907f16",
          "url": "https://github.com/jonattanva/luna-form/commit/ae711b575565958d5409455f82716bd04166b7f5"
        },
        "date": 1775518416785,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022679400000000668,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033274639999999636,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04147537,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010372380000000022,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002426458000000025,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04796907600000009,
            "unit": "ms"
          }
        ]
      },
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
          "id": "498e8f2084db2c56eb8012bafa7161160775dc52",
          "message": "feat: add timezone select component and unit/e2e tests",
          "timestamp": "2026-04-09T09:01:53-05:00",
          "tree_id": "ffad86786a48c87ae549ea9975e2a7e8acf9cb74",
          "url": "https://github.com/jonattanva/luna-form/commit/498e8f2084db2c56eb8012bafa7161160775dc52"
        },
        "date": 1775743368065,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002614160000000027,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003708438000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04483714800000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013450359999999364,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001630991999999992,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04328573600000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5bb445faa4843d6236ea15ccbf93c2a1c3642e10",
          "message": "chore: formatting and minor refactors in svelte-luna-editor and luna-svelte",
          "timestamp": "2026-04-09T09:04:47-05:00",
          "tree_id": "b7bd3a34c89bb81645b4067fe2feea4cc960582a",
          "url": "https://github.com/jonattanva/luna-form/commit/5bb445faa4843d6236ea15ccbf93c2a1c3642e10"
        },
        "date": 1775743531646,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0020807300000000167,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033998559999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041968650000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010201860000000806,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002018854000000033,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.040092041999999994,
            "unit": "ms"
          }
        ]
      },
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
          "id": "60abfa64a4ecccd0cd73cdb50e7b8d798896d16d",
          "message": "fix(luna-core): always include Suggested group in getTimezones\n\nCreate the detected timezone item before the loop so the Suggested group\nis always prepended, even when the detected timezone is not found in\nIntl.supportedValuesOf('timeZone') (e.g. UTC on GitHub Actions runners).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T09:33:08-05:00",
          "tree_id": "d9e7e243a582e609c5df8a23d45fc59ad1ea7221",
          "url": "https://github.com/jonattanva/luna-form/commit/60abfa64a4ecccd0cd73cdb50e7b8d798896d16d"
        },
        "date": 1775745250804,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002569968000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036860980000000152,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041689977999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010239359999999352,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0022725719999999684,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04255225200000007,
            "unit": "ms"
          }
        ]
      },
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
          "id": "83d3e11c96191091e6df064b5025ba0695ae8ef7",
          "message": "fix(tests): fix timezone e2e test failures across browsers\n\nUse getByRole('combobox', { name: /Timezone/ }) to avoid strict mode\nviolation in WebKit where both the input and the trigger button resolve\nto role=\"combobox\". Replace toContainText on the form with toHaveValue\non the combobox input, since input values are not part of textContent.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T10:33:54-05:00",
          "tree_id": "5abf32d6bd96d95370dc8e400c082a6f2e7319a3",
          "url": "https://github.com/jonattanva/luna-form/commit/83d3e11c96191091e6df064b5025ba0695ae8ef7"
        },
        "date": 1775748870127,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025141380000000026,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003448280000000068,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.042449123999999984,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0009817720000000918,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0018690840000000434,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04312498200000005,
            "unit": "ms"
          }
        ]
      },
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
          "id": "07296fe78e440be2ddd9bb965f2c18c11685e189",
          "message": "feat: add time input format support and column description\n\n- Add TimeFormat type, Time type, INPUT_TIME constant, and isTime type guard to luna-core\n- Implement toNativeTime and fromNativeTime utilities using date-fns for format conversion\n- Add getTimeFormat helper and wire fromNativeTime into input onChange via getValue callback\n- Add step attribute (60 or 1) to time inputs based on format precision\n- Support description field on Column type and render it below the grid in the React component\n- Add unit tests for toNativeTime, fromNativeTime, and getWeekDays\n- Add e2e tests for time field format rendering, initial values, and form submission\n- Add e2e tests for column description rendering and positioning\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T17:56:51-05:00",
          "tree_id": "65129a74ee80e14db6999b00b6b22da56f1c4540",
          "url": "https://github.com/jonattanva/luna-form/commit/07296fe78e440be2ddd9bb965f2c18c11685e189"
        },
        "date": 1775775465603,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0026436639999999445,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003703621999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04128747800000008,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011183899999999767,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0023465040000000955,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.046322349999999915,
            "unit": "ms"
          }
        ]
      },
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
          "id": "acff75220cf1cc91ea0c068a7eb67212106c1781",
          "message": "upgrade dependencies",
          "timestamp": "2026-04-09T18:10:14-05:00",
          "tree_id": "c8807c2beb7bb37edc3ad8e33cb202bc37df0c2e",
          "url": "https://github.com/jonattanva/luna-form/commit/acff75220cf1cc91ea0c068a7eb67212106c1781"
        },
        "date": 1775776258241,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002564734000000044,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034623639999999795,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03857445800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010980900000000702,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0025026020000000243,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.038051512,
            "unit": "ms"
          }
        ]
      },
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
          "id": "2743f272aa547eebf6e4cf1ce6108c82e360044a",
          "message": "feat: add select/day field type support with e2e tests\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-10T12:06:16-05:00",
          "tree_id": "125fe2f0dd5cbc780db7b360636fa44ccfef0a65",
          "url": "https://github.com/jonattanva/luna-form/commit/2743f272aa547eebf6e4cf1ce6108c82e360044a"
        },
        "date": 1775840823031,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002515614000000028,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003613890000000083,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.042364058,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0014795319999999492,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016382879999999886,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.045988068,
            "unit": "ms"
          }
        ]
      },
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
          "id": "fd396505587bab78f3203eee3b4151b74171c5b9",
          "message": "feat(chips): add advanced.multiple prop to chips fields\n\nAdd `advanced.multiple` boolean to chips field types to control single vs multi-select behavior. Defaults to true (existing behavior). When false, selecting a chip replaces any previous selection.\n\nAlso migrates unit tests from Playwright to Vitest and splits operator tests into individual files per operator.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T00:55:24-05:00",
          "tree_id": "f66e8c95844ce36f1707ad5fe7a6cfb8ae687812",
          "url": "https://github.com/jonattanva/luna-form/commit/fd396505587bab78f3203eee3b4151b74171c5b9"
        },
        "date": 1775886992641,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0027375319999999874,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00373165199999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03853132600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010999199999999973,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0019013499999999794,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04363672999999994,
            "unit": "ms"
          }
        ]
      },
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
          "id": "6449c3204c3b0997b7ee80dcdc0abb3f3bf41857",
          "message": "chore: upgrade dependencies across examples and svelte editor\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T01:00:30-05:00",
          "tree_id": "4372fc2728dcba9339aa8c38465811d344a89975",
          "url": "https://github.com/jonattanva/luna-form/commit/6449c3204c3b0997b7ee80dcdc0abb3f3bf41857"
        },
        "date": 1775887281714,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022820420000000466,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003437814000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041470898000000034,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001004726000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002302522000000067,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04655678599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "6575fc019b4158edd644c7ee9be4c7d088968e4b",
          "message": "feat(chips): add chips/month type and fix isChipsMonths checker\n\n- Add CHIPS_MONTHS constant and fix isChipsMonths to use it instead of CHIPS\n- Register chips/month in defineChips config\n- Inline defineSelect into buildCommon, removing one-line wrapper\n- Add store-helper unit tests for nested atoms, omitKey, clearAll, bulkReport\n- Upgrade turbo to 2.9.6\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T14:19:53-05:00",
          "tree_id": "0bc3d987c446b8c755e5b2b8b0a3cd38312cec12",
          "url": "https://github.com/jonattanva/luna-form/commit/6575fc019b4158edd644c7ee9be4c7d088968e4b"
        },
        "date": 1775935239219,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022689060000000154,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003870679999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03986375200000009,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001077156000000059,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0019155020000000604,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.037983703999999986,
            "unit": "ms"
          }
        ]
      },
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
          "id": "71bc6fb95b6d73f52ebd4e97b502c3fae0156a93",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-11T14:28:15-05:00",
          "tree_id": "134a90896ae4262f96bddf5194eba8d7d843debb",
          "url": "https://github.com/jonattanva/luna-form/commit/71bc6fb95b6d73f52ebd4e97b502c3fae0156a93"
        },
        "date": 1775935729996,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002708083999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036398880000000416,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03778979000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000964994000000047,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0023504840000000515,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03779343800000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "4bf11ff48370d1ca210dd7bda6c88a7577343ede",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T16:37:42-05:00",
          "tree_id": "b1bf6fa83b2c2d7c9e3120fe7a3d271a6ba3fb07",
          "url": "https://github.com/jonattanva/luna-form/commit/4bf11ff48370d1ca210dd7bda6c88a7577343ede"
        },
        "date": 1775943490227,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002702476000000047,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003806467999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040044235999999955,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010393960000000106,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0024366019999999934,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.044777514,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5e09c57057cdad6e075f9181a5debe56ce4af40e",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T16:44:05-05:00",
          "tree_id": "69df350ad435bc30adf68178a0f1143e2ed163b5",
          "url": "https://github.com/jonattanva/luna-form/commit/5e09c57057cdad6e075f9181a5debe56ce4af40e"
        },
        "date": 1775943876733,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022305900000000067,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034638400000000045,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.039587099999999965,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011221439999999348,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0023921679999999697,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04035191600000007,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f1605010274e04c1bde857f5cd72b08f1806404b",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T17:10:52-05:00",
          "tree_id": "fbd84e430cb26941983ff270522fb1e97073191a",
          "url": "https://github.com/jonattanva/luna-form/commit/f1605010274e04c1bde857f5cd72b08f1806404b"
        },
        "date": 1775945482241,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022721700000000737,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003459310000000073,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041285529999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010445139999999355,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002400850000000105,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.039256132000000096,
            "unit": "ms"
          }
        ]
      },
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
          "id": "1624020ddd8ab3bcbf8e76c9c4837657f9617415",
          "message": "new input/date",
          "timestamp": "2026-04-13T19:02:07-05:00",
          "tree_id": "144bdca0b2dc60b89fd6db8e201e629ec0816824",
          "url": "https://github.com/jonattanva/luna-form/commit/1624020ddd8ab3bcbf8e76c9c4837657f9617415"
        },
        "date": 1776124984272,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023359879999999295,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003760126000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03937841399999991,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010567459999999756,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0022987319999999726,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04074590599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "62f7045eead4e08d68647113679cf63042af7e6e",
          "message": "feat: default date format to MMMM d, yyyy and improved input handling",
          "timestamp": "2026-04-14T23:01:22-05:00",
          "tree_id": "c2dc5e0581e3bf72a43012d5900709c071356a6f",
          "url": "https://github.com/jonattanva/luna-form/commit/62f7045eead4e08d68647113679cf63042af7e6e"
        },
        "date": 1776225741036,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00223965000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033511199999999805,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.043441534000000046,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011457540000000108,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001805494000000067,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04226866199999995,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bc0392f58d506228bcf245c5622375bb8cad40a6",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-15T11:54:00-05:00",
          "tree_id": "feddd7b97bb2cbdbcf665712d9a2f63f288faa8c",
          "url": "https://github.com/jonattanva/luna-form/commit/bc0392f58d506228bcf245c5622375bb8cad40a6"
        },
        "date": 1776272091868,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0024574199999999563,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003752689999999916,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040082377999999946,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010650440000000573,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0017626339999999346,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.043208245999999915,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a84486da9d1dc571a2976d7b215c9e9dec2f836f",
          "message": "feat: add timezone utilities and refactor input components\n\nIntroduce timezone data loading/compute utilities in luna-core and a\ntimezone input in luna-react. Split the input component into focused\nbase/create/dateable/selectable/textable modules with shared strategies\nand hooks. Fix e2e description locator to avoid strict-mode collision\nwith the code editor.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
          "timestamp": "2026-04-17T21:46:55-05:00",
          "tree_id": "f7fbbe304d9587b00546b496c6e62fa8e1162436",
          "url": "https://github.com/jonattanva/luna-form/commit/a84486da9d1dc571a2976d7b215c9e9dec2f836f"
        },
        "date": 1776480621713,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00244222400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003783525999999938,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04067722200000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010602999999999839,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0019016900000000305,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.038837186000000086,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bc0392f58d506228bcf245c5622375bb8cad40a6",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-15T11:54:00-05:00",
          "tree_id": "feddd7b97bb2cbdbcf665712d9a2f63f288faa8c",
          "url": "https://github.com/jonattanva/luna-form/commit/bc0392f58d506228bcf245c5622375bb8cad40a6"
        },
        "date": 1776531350484,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0021973659999999884,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0032024040000000016,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.058379883999999944,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011486680000000434,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001755260000000021,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04103062,
            "unit": "ms"
          }
        ]
      },
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
          "id": "dad979331a8ffc1b1f776a6f02fb107aeee8adca",
          "message": "upgrade version",
          "timestamp": "2026-04-19T21:58:03-05:00",
          "tree_id": "5796fd00ea9799919b1b82676a85c4e4da5c9e01",
          "url": "https://github.com/jonattanva/luna-form/commit/dad979331a8ffc1b1f776a6f02fb107aeee8adca"
        },
        "date": 1776653931173,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0027171200000000225,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003653096000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040853026,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001056944000000044,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0022909779999999956,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04032886199999996,
            "unit": "ms"
          }
        ]
      },
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
          "id": "717d37a280d536878f7400c1c69c62429f68babe",
          "message": "fix(react-luna-editor): use useSyncExternalStore to avoid synchronous setState in theme-toggle",
          "timestamp": "2026-04-19T22:24:53-05:00",
          "tree_id": "1abb1f5a904c184c20554f0de176205d80ca54cb",
          "url": "https://github.com/jonattanva/luna-form/commit/717d37a280d536878f7400c1c69c62429f68babe"
        },
        "date": 1776655528076,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002963451999999961,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.005248875999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.05239286800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013370760000000245,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002123703999999975,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.06069812999999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "be457a116105b57db967c487f7ec5264785c5c23",
          "message": "upgrade dependecies",
          "timestamp": "2026-04-29T21:49:08-05:00",
          "tree_id": "23615aef3a1f3f577b945cd22396ab20fab1bc28",
          "url": "https://github.com/jonattanva/luna-form/commit/be457a116105b57db967c487f7ec5264785c5c23"
        },
        "date": 1777517398002,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0027363159999999878,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0037302440000000843,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03975380400000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0012139159999999265,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0015772620000000187,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.040352100000000064,
            "unit": "ms"
          }
        ]
      },
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
          "id": "835bc3983141736d4282123f4a6274c2c0c9142c",
          "message": "chore: update code",
          "timestamp": "2026-04-30T12:14:18-05:00",
          "tree_id": "b85ca64af298bb5a78b46e0b507721a582680b92",
          "url": "https://github.com/jonattanva/luna-form/commit/835bc3983141736d4282123f4a6274c2c0c9142c"
        },
        "date": 1777569314308,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022999939999999697,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003321931999999947,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0436617,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001071606000000088,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0017935200000000577,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04434039800000005,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5d95326bb2e6a4fbb97d0070817e69aacb5cbb5b",
          "message": "new step componente",
          "timestamp": "2026-04-30T18:13:28-05:00",
          "tree_id": "af4ff742f60ccfbdb219f9582d444b43889dac44",
          "url": "https://github.com/jonattanva/luna-form/commit/5d95326bb2e6a4fbb97d0070817e69aacb5cbb5b"
        },
        "date": 1777590856274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025784459999999856,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0035954280000000836,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.038972488,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010531180000000404,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0026549400000000106,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.044252040000000076,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f644b339170a34d2a8347f175c1259cb3466f157",
          "message": "upgrade dependecies",
          "timestamp": "2026-04-30T18:27:55-05:00",
          "tree_id": "e0b4bc9cc10f77b811b2025ffca2bea381dc1012",
          "url": "https://github.com/jonattanva/luna-form/commit/f644b339170a34d2a8347f175c1259cb3466f157"
        },
        "date": 1777591729098,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002251566000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00349703999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04000645600000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010605540000000247,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0020282699999999067,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.044528458,
            "unit": "ms"
          }
        ]
      },
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
          "id": "7d7e1a714fb95f33f74a01b063dba9efb229cfe7",
          "message": "feat: add collapsible and collapsed support to list items",
          "timestamp": "2026-05-01T16:38:59-05:00",
          "tree_id": "04884fddfb1d17e19dd8f2c3c5e8aa5a2de0ebaa",
          "url": "https://github.com/jonattanva/luna-form/commit/7d7e1a714fb95f33f74a01b063dba9efb229cfe7"
        },
        "date": 1777671588214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002538783999999964,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.004022115999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03899854599999992,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010198359999999411,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002275386000000026,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04075381000000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a045de4a92d3f4d0e382a2beab62f36fbcfbebd5",
          "message": "chore: update pnpm-lock.yaml with tool updates",
          "timestamp": "2026-05-02T14:36:20-05:00",
          "tree_id": "ebd265db3dfd0c93331c14a7ba5027c1e809d941",
          "url": "https://github.com/jonattanva/luna-form/commit/a045de4a92d3f4d0e382a2beab62f36fbcfbebd5"
        },
        "date": 1777750622519,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002950117999999975,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003512450000000058,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04010623199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001008730000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00155806199999995,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04434371399999998,
            "unit": "ms"
          }
        ]
      },
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
          "id": "804fe6b53d31c0962b4c2c67b20bc651aff67707",
          "message": "ci: increase e2e-test timeout to 30 minutes",
          "timestamp": "2026-05-02T21:59:40-05:00",
          "tree_id": "02d4c92d32a61e39e965194fd2250044880e7dab",
          "url": "https://github.com/jonattanva/luna-form/commit/804fe6b53d31c0962b4c2c67b20bc651aff67707"
        },
        "date": 1777777221377,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002794234000000074,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003773719999999912,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04155012399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010788120000000845,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0020855920000000198,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.042004291999999964,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b3d0c151456d0db8f86b19002e74e2f47816adb1",
          "message": "feat: implement generic Chips component and update luna-core types",
          "timestamp": "2026-05-04T12:18:58-05:00",
          "tree_id": "a4a21177912239d12136fc47e2a16978c7020cc1",
          "url": "https://github.com/jonattanva/luna-form/commit/b3d0c151456d0db8f86b19002e74e2f47816adb1"
        },
        "date": 1777915194675,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025357020000000147,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036890319999999975,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04430306800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0012285879999999452,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00254553999999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.045309888,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c451835cb7e100cc3e1518934f4cf832ce3e65be",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-04T12:51:33-05:00",
          "tree_id": "c84e6bea6756d3fcd91c725f1c875e0df2d343d5",
          "url": "https://github.com/jonattanva/luna-form/commit/c451835cb7e100cc3e1518934f4cf832ce3e65be"
        },
        "date": 1777917146182,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0025910720000000536,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036858320000000048,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04079433199999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010650640000000066,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0020164720000000217,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04246824000000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8536cb623a0be901e1916e89e72658a1a9c951a1",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-04T12:52:33-05:00",
          "tree_id": "b6ed43edb8a352b922b81f09db8fce3b0e7760ef",
          "url": "https://github.com/jonattanva/luna-form/commit/8536cb623a0be901e1916e89e72658a1a9c951a1"
        },
        "date": 1777917204950,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0024613960000000362,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036291879999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04053940799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010385299999999234,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002334539999999947,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03987541600000009,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8d3189b47da2fa029090cf66192ea18c1f3c0555",
          "message": "refactor: optimize collapsible list headers and enhance list add button UI\n\n- Extract resolveValue into a shared utility to fix preview issues in collapsed items.\n- Enhance FieldList and FieldListItem styling (dashed borders, centered add button, space-between counter).\n- Improve collapsible header interaction: whole header is now clickable and underlies on hover.\n- Fix regression where previews in collapsed items would be empty on first render by falling back to initial values.\n- Update dependencies and bump package versions to 0.0.47.\n- Add comprehensive E2E tests for list add button and collapsible headers.",
          "timestamp": "2026-05-05T17:00:03-05:00",
          "tree_id": "e5eef55a0fe0495020ab0cbd0340d709bdb3e867",
          "url": "https://github.com/jonattanva/luna-form/commit/8d3189b47da2fa029090cf66192ea18c1f3c0555"
        },
        "date": 1778018454654,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023436960000000227,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003526279999999929,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03853468400000008,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010260319999999864,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00183104000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.044339504000000036,
            "unit": "ms"
          }
        ]
      },
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
          "id": "2c6448c396bdba0cc40e0f6233b6fc3ca63f6433",
          "message": "feat: coerce select/active values to boolean and fix data pass-through in luna-react",
          "timestamp": "2026-05-07T12:50:22-05:00",
          "tree_id": "3dad5daa9517b2af292474f3c2039aa9142e2a0c",
          "url": "https://github.com/jonattanva/luna-form/commit/2c6448c396bdba0cc40e0f6233b6fc3ca63f6433"
        },
        "date": 1778176272193,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002512625999999955,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003256024000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04090666400000009,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010418999999999414,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.001736385999999925,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04058850400000006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "0b879cb208118be81c71c2a295cc4c0795728265",
          "message": "fix: allow boolean false in required select/active fields",
          "timestamp": "2026-05-07T13:26:21-05:00",
          "tree_id": "46a21dac44100e80c9d2b8f3971210c3da147c58",
          "url": "https://github.com/jonattanva/luna-form/commit/0b879cb208118be81c71c2a295cc4c0795728265"
        },
        "date": 1778178439024,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0021839200000000575,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003337511999999947,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04072404800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001010627999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002435267999999951,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.042109594000000014,
            "unit": "ms"
          }
        ]
      },
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
          "id": "2e73703b5dd688f79b800b9898e2a8c639b90eee",
          "message": "feat: add string transformation support to input fields (uppercase, lowercase, remove-space, remove-accent)",
          "timestamp": "2026-05-07T22:41:11-05:00",
          "tree_id": "ea8c87e514c7691dc78cf2b22d735f0a2bddbabe",
          "url": "https://github.com/jonattanva/luna-form/commit/2e73703b5dd688f79b800b9898e2a8c639b90eee"
        },
        "date": 1778211727015,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023519079999999803,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033569139999999604,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041742075999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013590040000000271,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016340340000000424,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04145474000000002,
            "unit": "ms"
          }
        ]
      },
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
          "id": "406d5540ef4eb80a9de00f8bd3c46c9bb3f08a65",
          "message": "fix: restore @perf tag to E2E Benchmark",
          "timestamp": "2026-05-07T22:48:48-05:00",
          "tree_id": "16cd0934ccc46ada588d14c4e1b6d25a880d1814",
          "url": "https://github.com/jonattanva/luna-form/commit/406d5540ef4eb80a9de00f8bd3c46c9bb3f08a65"
        },
        "date": 1778212177232,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002786299999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0035100100000000794,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.039162164000000076,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001023461999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002267655999999988,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04517622599999993,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8a45dec49fe9d41537510319324559263a6454a3",
          "message": "feat: enhance schema validation and event documentation\n\n- Update luna-core to support array-based validation for chips and lists\n- Refactor useValue hook in luna-react to apply transforms during resolution\n- Add comprehensive documentation for the change event system (ValueEvent, StateEvent, SourceEvent)\n- Fix E2E tests related to date selection types (string to number)\n- Improve resolveValue to safely handle object traversal",
          "timestamp": "2026-05-08T10:44:32-05:00",
          "tree_id": "f321f00b2ff846b3d1eacdb4e044d12c1f4baaf1",
          "url": "https://github.com/jonattanva/luna-form/commit/8a45dec49fe9d41537510319324559263a6454a3"
        },
        "date": 1778255131917,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002338127999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034401360000000524,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0425155860000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0014235259999999244,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016651359999999614,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04719284200000004,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a1729ff78d6841d3d8ff08e44387da1a97a9e40a",
          "message": "fix(tests): resolve strict mode violation in steps spec",
          "timestamp": "2026-05-08T15:08:32-05:00",
          "tree_id": "6c056f2d67611dcd5e7b9e07bbb922733034f353",
          "url": "https://github.com/jonattanva/luna-form/commit/a1729ff78d6841d3d8ff08e44387da1a97a9e40a"
        },
        "date": 1778270967940,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002181821999999897,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00427503999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.044677348000000054,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011060380000000123,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0021613239999999224,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.049598612,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a3a84910f0a08cf4a989f4d98cf07a4be81a1e9c",
          "message": "test(e2e): fix flaky list-add-button hover test in firefox\n\n- enabled reducedMotion in playwright.config.ts\n- added motion-reduce:transition-none to AddButton\n- replaced hover({ force: true }) with dispatchEvent('mouseenter')\n- removed flaky setTimeout/raf waits in favour of reduced motion",
          "timestamp": "2026-05-08T15:46:22-05:00",
          "tree_id": "b646fe9bf34b40477079b6eb629d639aa60cfb67",
          "url": "https://github.com/jonattanva/luna-form/commit/a3a84910f0a08cf4a989f4d98cf07a4be81a1e9c"
        },
        "date": 1778273238721,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0029893540000000486,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003568877999999927,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.042174126,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001063130000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0024054800000000115,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.05175389799999994,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bdb29e384aaf80104a0178460ff58dcf6c1b7d1a",
          "message": "fix(luna-react): disable transition on list add button for stable e2e testing",
          "timestamp": "2026-05-08T23:24:30-05:00",
          "tree_id": "7462c34d4e09a3285c162eefde036f841738ec96",
          "url": "https://github.com/jonattanva/luna-form/commit/bdb29e384aaf80104a0178460ff58dcf6c1b7d1a"
        },
        "date": 1778300710647,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002454400000000078,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0035292680000000016,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03911696000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001089992000000052,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0018067579999999452,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04347500600000001,
            "unit": "ms"
          }
        ]
      },
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
          "id": "08e501c25d28a46677b13687ade0e4fa19ae78ac",
          "message": "fix(test): wait for hover styles in list-add-button e2e",
          "timestamp": "2026-05-08T23:52:33-05:00",
          "tree_id": "a9381db64be79d674a25c17255bd9218c9540992",
          "url": "https://github.com/jonattanva/luna-form/commit/08e501c25d28a46677b13687ade0e4fa19ae78ac"
        },
        "date": 1778302402891,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0024086099999999534,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0037880579999999783,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.050400859999999964,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0014060240000000022,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002604314000000045,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04623556199999996,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b754720db2fa4b6a850d0d6c90dbdafde7ad11d8",
          "message": "refactor(tests): update e2e test tags format and remove unstable hover test",
          "timestamp": "2026-05-09T00:06:42-05:00",
          "tree_id": "54f78ea43aa7b052903d69968d3f018110b13e76",
          "url": "https://github.com/jonattanva/luna-form/commit/b754720db2fa4b6a850d0d6c90dbdafde7ad11d8"
        },
        "date": 1778303256215,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023689900000000534,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003315052000000037,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04193632199999991,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010592719999999644,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016365480000000616,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04706543199999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "aaeabca8f3429c5f38bcf0c0a74feb6dfadc8f97",
          "message": "format files",
          "timestamp": "2026-05-09T00:35:39-05:00",
          "tree_id": "716706fe0ae70a8a98f7e4862999a8e578089578",
          "url": "https://github.com/jonattanva/luna-form/commit/aaeabca8f3429c5f38bcf0c0a74feb6dfadc8f97"
        },
        "date": 1778304994022,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0027198359999999868,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0036752440000000206,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040012110000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0009890980000000127,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016170679999999039,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.039742524,
            "unit": "ms"
          }
        ]
      },
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
          "id": "3763b8d186d531c8e29fe787c37ea6ad875b5f35",
          "message": "docs: add internal link to Condition object in change event documentation",
          "timestamp": "2026-05-09T11:50:54-05:00",
          "tree_id": "700088030b6e117c051ea02652c1e7108b513ccf",
          "url": "https://github.com/jonattanva/luna-form/commit/3763b8d186d531c8e29fe787c37ea6ad875b5f35"
        },
        "date": 1778345487879,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0024468560000000254,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034311680000000708,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.042437446000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011334699999999884,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002516525999999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04372742800000003,
            "unit": "ms"
          }
        ]
      },
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
          "id": "d6ca7c2df0e3f8ee281af4935777a9e2db0cfaf9",
          "message": "feat: implement relative target resolution in list events using 'list/field' syntax and update docs",
          "timestamp": "2026-05-09T22:51:04-05:00",
          "tree_id": "0d2a0c3b6db83e8e03fcd8f92c0357bc9ab6fd34",
          "url": "https://github.com/jonattanva/luna-form/commit/d6ca7c2df0e3f8ee281af4935777a9e2db0cfaf9"
        },
        "date": 1778385121175,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0022153200000000197,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0027753240000000117,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02954123800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0007766500000000178,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0013204920000000015,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03127134599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c0e3503c845a49a7e35ede31551f6fa1542f9bf7",
          "message": "feat: add conditional interpolation and liquid format filters\n\n- Implement date and currency formatting for interpolation\n- Add conditional rendering for list items and descriptions\n- Update state handling for events\n- Add e2e and unit tests for new features",
          "timestamp": "2026-05-11T08:26:56-05:00",
          "tree_id": "ee9206d9526c7ea560c9e1cbed49a8d20fba6e74",
          "url": "https://github.com/jonattanva/luna-form/commit/c0e3503c845a49a7e35ede31551f6fa1542f9bf7"
        },
        "date": 1778506087891,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0017478300000000218,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.002655695999999978,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.029746058000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0007671740000000113,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0014409479999999916,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03330986200000001,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f93c5aec03e3c6176323244f989d952120bae471",
          "message": "fix(luna-react): resolve value hydration in InputBase and add E2E tests for onlyIfTargetEmpty",
          "timestamp": "2026-05-11T12:07:31-05:00",
          "tree_id": "808c0118ee6198eaea01f00e4816a0c20b27300e",
          "url": "https://github.com/jonattanva/luna-form/commit/f93c5aec03e3c6176323244f989d952120bae471"
        },
        "date": 1778519316629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0023657480000000533,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003673725999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.041215506000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0010542219999999816,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0020245859999999992,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04324782600000003,
            "unit": "ms"
          }
        ]
      },
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
          "id": "785039e2b646ccc04a5f9a6030081dce1a5f4053",
          "message": "chore: formatting and package updates",
          "timestamp": "2026-05-11T18:14:32-05:00",
          "tree_id": "5dac4503d6fc013e936c392c12be17988be895f9",
          "url": "https://github.com/jonattanva/luna-form/commit/785039e2b646ccc04a5f9a6030081dce1a5f4053"
        },
        "date": 1778541314955,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002280528000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0033222339999999803,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04429804999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0013728419999999915,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.002085328000000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.042967168000000014,
            "unit": "ms"
          }
        ]
      },
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
          "id": "69e1f0f2214fefdcb41fddf5376af68f28acbf1f",
          "message": "docs: remove deprecated collapsible property from list field and update types",
          "timestamp": "2026-05-11T22:11:48-05:00",
          "tree_id": "7fb26dc27d715b820c2e923623e88caada13222e",
          "url": "https://github.com/jonattanva/luna-form/commit/69e1f0f2214fefdcb41fddf5376af68f28acbf1f"
        },
        "date": 1778555555630,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002468085999999971,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0032684600000000047,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.04307248799999991,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0011202500000000554,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0024465260000000625,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04207484599999998,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f657ac7f184bfb0839a7e2c77f4d7aff4f671fd6",
          "message": "feat: add reactive preview label conditions for list items and bump versions to 0.0.50",
          "timestamp": "2026-05-12T11:28:19-05:00",
          "tree_id": "5aa15ebe9f2fb291b845bd962aee26010eb4d61d",
          "url": "https://github.com/jonattanva/luna-form/commit/f657ac7f184bfb0839a7e2c77f4d7aff4f671fd6"
        },
        "date": 1778603356110,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002596994000000109,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0034896380000000136,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03852847599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000994038000000046,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0018596220000000586,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03789864599999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ae5316a7a2fff5a7fabd20c9ec5d632a6bd3c03f",
          "message": "fix(core): improve select/active input handling and update dependencies",
          "timestamp": "2026-05-12T14:45:35-05:00",
          "tree_id": "53da4557ad16e0dde2aee8ff1d3e3176efce2b38",
          "url": "https://github.com/jonattanva/luna-form/commit/ae5316a7a2fff5a7fabd20c9ec5d632a6bd3c03f"
        },
        "date": 1778615206636,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.003043105999999966,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.005564399999999978,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03896065599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0009637599999999793,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0016484940000000279,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.040390157999999926,
            "unit": "ms"
          }
        ]
      },
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
          "id": "d58eebeb771c928a55574b8a50c9fb9555b19277",
          "message": "ci: increase e2e test timeout to 60 minutes",
          "timestamp": "2026-05-12T15:21:28-05:00",
          "tree_id": "29699c8b625aa63d7ce7d31a51fc8af2d9c7979d",
          "url": "https://github.com/jonattanva/luna-form/commit/d58eebeb771c928a55574b8a50c9fb9555b19277"
        },
        "date": 1778617322197,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0017159719999999652,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0027805800000000433,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02981996799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0007541799999999625,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0014405360000000087,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.033644384,
            "unit": "ms"
          }
        ]
      },
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
          "id": "dd8bf2c9f57c18795c4d96118e9f296fed4d58fc",
          "message": "test: add missing collapsible configuration to advanced section tests",
          "timestamp": "2026-05-12T16:41:23-05:00",
          "tree_id": "f0ec3c63451fdbf355534cb3b62a8552278971d4",
          "url": "https://github.com/jonattanva/luna-form/commit/dd8bf2c9f57c18795c4d96118e9f296fed4d58fc"
        },
        "date": 1778622130446,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.002839249999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.003786736000000019,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.039623933999999965,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.001081388000000061,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0015711619999999584,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.04369331399999999,
            "unit": "ms"
          }
        ]
      },
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
          "id": "049f1d18dd79fc0827f7994b51a8d1014b6bb503",
          "message": "chore: reduce benchmark noise by increasing iterations and relaxing thresholds",
          "timestamp": "2026-05-12T17:21:28-05:00",
          "tree_id": "0cf720b5a9cefa05102c1d74cd6d4a725e7c1bc0",
          "url": "https://github.com/jonattanva/luna-form/commit/049f1d18dd79fc0827f7994b51a8d1014b6bb503"
        },
        "date": 1778624537665,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035400576,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011432706599999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.035638515399999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041278299999999947,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005963551000000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03058972286,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ae37df7417e08d82615fd0a34f48ebe9b98d370b",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-14T11:37:49-05:00",
          "tree_id": "0443196f5ded5f819fa32fee96456b7bc85b2ebf",
          "url": "https://github.com/jonattanva/luna-form/commit/ae37df7417e08d82615fd0a34f48ebe9b98d370b"
        },
        "date": 1778776731322,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00038565117999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011393513599999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03900529542,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0005110247199999958,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006562800599999992,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0307040006,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ee583f7b66f4efb62241b284646651c5b0e9165a",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-14T12:37:47-05:00",
          "tree_id": "0db436d54845b66d06afdfa95e81e7e7f1fc1559",
          "url": "https://github.com/jonattanva/luna-form/commit/ee583f7b66f4efb62241b284646651c5b0e9165a"
        },
        "date": 1778780327593,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003487715199999991,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011479370400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03258772081999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004200432599999931,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006034174399999938,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028390386939999998,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c5dc8d96de70f39553768e08b80c08e6a3b06d8c",
          "message": "chore: update packages and add new e2e test",
          "timestamp": "2026-05-14T14:27:58-05:00",
          "tree_id": "0e020bd4276932a063b8e76710d05ca298151912",
          "url": "https://github.com/jonattanva/luna-form/commit/c5dc8d96de70f39553768e08b80c08e6a3b06d8c"
        },
        "date": 1778786928073,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037078739999999924,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011480087400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03251134502,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004395194199999969,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006233113200000025,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0288293055,
            "unit": "ms"
          }
        ]
      },
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
          "id": "52853f0d62e13c92b720e6e5e494c9bc4f5a4579",
          "message": "fix(core): improve value-event autofill handling and update dependencies",
          "timestamp": "2026-05-14T22:27:26-05:00",
          "tree_id": "a6937280c510711ee8017fff3b6d1d1fda77404b",
          "url": "https://github.com/jonattanva/luna-form/commit/52853f0d62e13c92b720e6e5e494c9bc4f5a4579"
        },
        "date": 1778815701638,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037601111999999945,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0012010731800000008,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.033901483159999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004468845200000033,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006272431600000073,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028627401580000007,
            "unit": "ms"
          }
        ]
      },
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
          "id": "0948ac0d671737003f703b1b45338d9c8c94f16d",
          "message": "fix: support array conditions, improve auto-fill handling, and clear hidden field values",
          "timestamp": "2026-05-19T18:43:57-05:00",
          "tree_id": "325f165129a4168e208655a2a382827e9f100370",
          "url": "https://github.com/jonattanva/luna-form/commit/0948ac0d671737003f703b1b45338d9c8c94f16d"
        },
        "date": 1779234291308,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035761804000000096,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.001143538299999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03589199878,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004204710599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005955245800000012,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030258505460000005,
            "unit": "ms"
          }
        ]
      },
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
          "id": "84e530860dfc23171436df8383492f887de81145",
          "message": "fix css",
          "timestamp": "2026-05-20T18:20:55-05:00",
          "tree_id": "c979b856ba62083a0b4621cddd36e571d042c350",
          "url": "https://github.com/jonattanva/luna-form/commit/84e530860dfc23171436df8383492f887de81145"
        },
        "date": 1779319308843,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00038702232000000094,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011496921799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03616898668,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004216797399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006124536399999943,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0314130149,
            "unit": "ms"
          }
        ]
      }
    ],
    "Luna Form browser benchmarks": [
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
        "date": 1771702850962,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 4934,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 682,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b8e02e2e450e7d316bf2fb2b0f0aa0ce52235d44",
          "message": "Upgrade...",
          "timestamp": "2026-02-21T15:03:49-05:00",
          "tree_id": "bd572ea5844a177a621103185033be594159117f",
          "url": "https://github.com/jonattanva/luna-form/commit/b8e02e2e450e7d316bf2fb2b0f0aa0ce52235d44"
        },
        "date": 1771704289854,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 266,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 451,
            "unit": "ms"
          }
        ]
      },
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
          "id": "28807dc92ecc0836a8eba86604ef0f694a5d2ad7",
          "message": "test(e2e): fix ambiguous getByText selector in translation spec",
          "timestamp": "2026-02-21T15:46:02-05:00",
          "tree_id": "058e053a4fc5402e523ac969d76dd5e7b41fb34f",
          "url": "https://github.com/jonattanva/luna-form/commit/28807dc92ecc0836a8eba86604ef0f694a5d2ad7"
        },
        "date": 1771706821799,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 250,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 187,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c05e3a70d29ca1e34ee0d806f44330d75c472a24",
          "message": "remove unnecessary code",
          "timestamp": "2026-02-22T22:34:49-05:00",
          "tree_id": "71bf3ec3d9ac197827d18b054d8c91f984ef5a2d",
          "url": "https://github.com/jonattanva/luna-form/commit/c05e3a70d29ca1e34ee0d806f44330d75c472a24"
        },
        "date": 1771817765894,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 245,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 200,
            "unit": "ms"
          }
        ]
      },
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
          "id": "59b2e286e9ca21a2e3805a19b1f8ba46ca655b20",
          "message": "refactor: rename guard components and extract list slot\n\n- Rename GuardWithSection to VisibilityGuard and GuardWithList to\n  ListGuard, following the XGuard naming pattern\n- Inline guard.ts helpers into visibility-guard.tsx and remove the file\n- Extract ListSlot from slot.tsx into its own list-slot.tsx\n- Fix ListGuard to use the client-side FieldList (with add button and\n  useFieldList hook) instead of the server-side version\n- Add list-visibility e2e tests and list-guard unit tests\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-23T16:57:26-05:00",
          "tree_id": "1bde4de6277b69b89bd93679347ac87eff4c4456",
          "url": "https://github.com/jonattanva/luna-form/commit/59b2e286e9ca21a2e3805a19b1f8ba46ca655b20"
        },
        "date": 1771883942269,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 256,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 149,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c6a2b7b2d878a71b5a39cc19d318dcc3e9f6114a",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T16:03:33-05:00",
          "tree_id": "ae69fd6d96edb33763c465d96dbe7b06ab5ea1ce",
          "url": "https://github.com/jonattanva/luna-form/commit/c6a2b7b2d878a71b5a39cc19d318dcc3e9f6114a"
        },
        "date": 1771967076705,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 255,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 206,
            "unit": "ms"
          }
        ]
      },
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
          "id": "43dfebeec02a4f610ef2f9cc07c83a8e49efca52",
          "message": "new version",
          "timestamp": "2026-02-24T17:03:06-05:00",
          "tree_id": "8ffe29f2527753876c6d2bb8439fd3f898e836b9",
          "url": "https://github.com/jonattanva/luna-form/commit/43dfebeec02a4f610ef2f9cc07c83a8e49efca52"
        },
        "date": 1771970664368,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 261,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 162,
            "unit": "ms"
          }
        ]
      },
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
          "id": "abcc4800e96e382bcbbdf037f18684b42e1de451",
          "message": "fix(string): bound markdown link regex quantifiers to prevent ReDoS\n\nAdds length limits to the REGEX_MARKDOWN_LINK quantifiers ({1,500} for\nlink text, {1,2000} for URL) to cap backtracking and eliminate O(n^2)\ncomplexity on adversarial inputs.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T21:47:34-05:00",
          "tree_id": "553cfe688964b8824f181daa81daf061f3882bc4",
          "url": "https://github.com/jonattanva/luna-form/commit/abcc4800e96e382bcbbdf037f18684b42e1de451"
        },
        "date": 1771987752904,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 253,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 172,
            "unit": "ms"
          }
        ]
      },
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
          "id": "18656f59f8bca6581d2204e16bfdc1696c5c9c82",
          "message": "fix(ci): restrict GITHUB_TOKEN to minimum required permissions\n\nAdds a workflow-level permissions block with contents: read to follow\nthe principle of least privilege.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-02-24T21:58:41-05:00",
          "tree_id": "522ff2c873cfb7b018e8a8c349943ffa76a455a6",
          "url": "https://github.com/jonattanva/luna-form/commit/18656f59f8bca6581d2204e16bfdc1696c5c9c82"
        },
        "date": 1771988382483,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 251,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 190,
            "unit": "ms"
          }
        ]
      },
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
          "id": "9ef22e2cc3e04685ef73dbf773e1d2d4c2879109",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T22:01:10-05:00",
          "tree_id": "d5b4e3f47f67e48d29bcaf9b23b0020f20f0d8d7",
          "url": "https://github.com/jonattanva/luna-form/commit/9ef22e2cc3e04685ef73dbf773e1d2d4c2879109"
        },
        "date": 1771988554779,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 236,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 563,
            "unit": "ms"
          }
        ]
      },
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
          "id": "4ca2fb6e76bffacf81bf524abbfb7269aff4cef4",
          "message": "upgrade dependencies",
          "timestamp": "2026-02-24T22:08:34-05:00",
          "tree_id": "f135f34bd4bf40f47c10ebeebbd1b0684ce9c4a3",
          "url": "https://github.com/jonattanva/luna-form/commit/4ca2fb6e76bffacf81bf524abbfb7269aff4cef4"
        },
        "date": 1771988972328,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 236,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 193,
            "unit": "ms"
          }
        ]
      },
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
          "id": "9faa801d3d4c71fe2d2af720ad6ad7016f4f760b",
          "message": "fix field description",
          "timestamp": "2026-02-27T11:53:51-05:00",
          "tree_id": "3afcb56bb70a09b322b43b89ea0baa58f02ec19c",
          "url": "https://github.com/jonattanva/luna-form/commit/9faa801d3d4c71fe2d2af720ad6ad7016f4f760b"
        },
        "date": 1772211311609,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 219,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 174,
            "unit": "ms"
          }
        ]
      },
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
          "id": "97321f5c8c41bfd74bf7d766d364a3d8f0116835",
          "message": "fix error",
          "timestamp": "2026-03-01T22:32:43-05:00",
          "tree_id": "d7a848131845a5736950ab61846346c98f1d0d11",
          "url": "https://github.com/jonattanva/luna-form/commit/97321f5c8c41bfd74bf7d766d364a3d8f0116835"
        },
        "date": 1772422441761,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 244,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 549,
            "unit": "ms"
          }
        ]
      },
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
          "id": "e28335eeaf8471672400de379507f787d48024ff",
          "message": "refactor: simplify orientation logic to use boolean horizontal property",
          "timestamp": "2026-03-09T20:06:17-05:00",
          "tree_id": "071df2f9ec55d195e3b95d32a1d9d068b731f3ab",
          "url": "https://github.com/jonattanva/luna-form/commit/e28335eeaf8471672400de379507f787d48024ff"
        },
        "date": 1773104860351,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 256,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 198,
            "unit": "ms"
          }
        ]
      },
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
          "id": "61fd3ffee0d7c31ae414046f821a1c810558dc19",
          "message": "chore: set rootDir in packages/luna-core/tsconfig.json",
          "timestamp": "2026-04-06T18:08:10-05:00",
          "tree_id": "c4e3176a114b449c498d6d719eb7572022baf544",
          "url": "https://github.com/jonattanva/luna-form/commit/61fd3ffee0d7c31ae414046f821a1c810558dc19"
        },
        "date": 1775516976115,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 255,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 639,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c0ffa2e9bfbdf4b0c634adfaba52a39fdc464a6f",
          "message": "chore: updates and fixes",
          "timestamp": "2026-04-06T18:14:47-05:00",
          "tree_id": "cd861a58c51a7c14d8a25b1cfa1686f755e972bd",
          "url": "https://github.com/jonattanva/luna-form/commit/c0ffa2e9bfbdf4b0c634adfaba52a39fdc464a6f"
        },
        "date": 1775517359139,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 250,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 649,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ae711b575565958d5409455f82716bd04166b7f5",
          "message": "fix(luna-svelte): replace Orientation type with horizontal boolean\n\nRemoves the removed Orientation type and HORIZONTAL/VERTICAL constants\nfrom luna-core imports, aligning luna-svelte with the orientation refactor.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-06T18:33:00-05:00",
          "tree_id": "7ad2424e138edb448814b2a6981cfaee60907f16",
          "url": "https://github.com/jonattanva/luna-form/commit/ae711b575565958d5409455f82716bd04166b7f5"
        },
        "date": 1775518450954,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 265,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 668,
            "unit": "ms"
          }
        ]
      },
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
          "id": "498e8f2084db2c56eb8012bafa7161160775dc52",
          "message": "feat: add timezone select component and unit/e2e tests",
          "timestamp": "2026-04-09T09:01:53-05:00",
          "tree_id": "ffad86786a48c87ae549ea9975e2a7e8acf9cb74",
          "url": "https://github.com/jonattanva/luna-form/commit/498e8f2084db2c56eb8012bafa7161160775dc52"
        },
        "date": 1775743404707,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 259,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 573,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5bb445faa4843d6236ea15ccbf93c2a1c3642e10",
          "message": "chore: formatting and minor refactors in svelte-luna-editor and luna-svelte",
          "timestamp": "2026-04-09T09:04:47-05:00",
          "tree_id": "b7bd3a34c89bb81645b4067fe2feea4cc960582a",
          "url": "https://github.com/jonattanva/luna-form/commit/5bb445faa4843d6236ea15ccbf93c2a1c3642e10"
        },
        "date": 1775743561339,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 258,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 627,
            "unit": "ms"
          }
        ]
      },
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
          "id": "60abfa64a4ecccd0cd73cdb50e7b8d798896d16d",
          "message": "fix(luna-core): always include Suggested group in getTimezones\n\nCreate the detected timezone item before the loop so the Suggested group\nis always prepended, even when the detected timezone is not found in\nIntl.supportedValuesOf('timeZone') (e.g. UTC on GitHub Actions runners).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T09:33:08-05:00",
          "tree_id": "d9e7e243a582e609c5df8a23d45fc59ad1ea7221",
          "url": "https://github.com/jonattanva/luna-form/commit/60abfa64a4ecccd0cd73cdb50e7b8d798896d16d"
        },
        "date": 1775745286986,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 264,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 606,
            "unit": "ms"
          }
        ]
      },
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
          "id": "83d3e11c96191091e6df064b5025ba0695ae8ef7",
          "message": "fix(tests): fix timezone e2e test failures across browsers\n\nUse getByRole('combobox', { name: /Timezone/ }) to avoid strict mode\nviolation in WebKit where both the input and the trigger button resolve\nto role=\"combobox\". Replace toContainText on the form with toHaveValue\non the combobox input, since input values are not part of textContent.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T10:33:54-05:00",
          "tree_id": "5abf32d6bd96d95370dc8e400c082a6f2e7319a3",
          "url": "https://github.com/jonattanva/luna-form/commit/83d3e11c96191091e6df064b5025ba0695ae8ef7"
        },
        "date": 1775749679273,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 281,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 681,
            "unit": "ms"
          }
        ]
      },
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
          "id": "07296fe78e440be2ddd9bb965f2c18c11685e189",
          "message": "feat: add time input format support and column description\n\n- Add TimeFormat type, Time type, INPUT_TIME constant, and isTime type guard to luna-core\n- Implement toNativeTime and fromNativeTime utilities using date-fns for format conversion\n- Add getTimeFormat helper and wire fromNativeTime into input onChange via getValue callback\n- Add step attribute (60 or 1) to time inputs based on format precision\n- Support description field on Column type and render it below the grid in the React component\n- Add unit tests for toNativeTime, fromNativeTime, and getWeekDays\n- Add e2e tests for time field format rendering, initial values, and form submission\n- Add e2e tests for column description rendering and positioning\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-09T17:56:51-05:00",
          "tree_id": "65129a74ee80e14db6999b00b6b22da56f1c4540",
          "url": "https://github.com/jonattanva/luna-form/commit/07296fe78e440be2ddd9bb965f2c18c11685e189"
        },
        "date": 1775775496203,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 663,
            "unit": "ms"
          }
        ]
      },
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
          "id": "acff75220cf1cc91ea0c068a7eb67212106c1781",
          "message": "upgrade dependencies",
          "timestamp": "2026-04-09T18:10:14-05:00",
          "tree_id": "c8807c2beb7bb37edc3ad8e33cb202bc37df0c2e",
          "url": "https://github.com/jonattanva/luna-form/commit/acff75220cf1cc91ea0c068a7eb67212106c1781"
        },
        "date": 1775776288745,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 277,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 664,
            "unit": "ms"
          }
        ]
      },
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
          "id": "2743f272aa547eebf6e4cf1ce6108c82e360044a",
          "message": "feat: add select/day field type support with e2e tests\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-10T12:06:16-05:00",
          "tree_id": "125fe2f0dd5cbc780db7b360636fa44ccfef0a65",
          "url": "https://github.com/jonattanva/luna-form/commit/2743f272aa547eebf6e4cf1ce6108c82e360044a"
        },
        "date": 1775841572549,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 275,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 633,
            "unit": "ms"
          }
        ]
      },
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
          "id": "fd396505587bab78f3203eee3b4151b74171c5b9",
          "message": "feat(chips): add advanced.multiple prop to chips fields\n\nAdd `advanced.multiple` boolean to chips field types to control single vs multi-select behavior. Defaults to true (existing behavior). When false, selecting a chip replaces any previous selection.\n\nAlso migrates unit tests from Playwright to Vitest and splits operator tests into individual files per operator.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T00:55:24-05:00",
          "tree_id": "f66e8c95844ce36f1707ad5fe7a6cfb8ae687812",
          "url": "https://github.com/jonattanva/luna-form/commit/fd396505587bab78f3203eee3b4151b74171c5b9"
        },
        "date": 1775887021713,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 269,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 659,
            "unit": "ms"
          }
        ]
      },
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
          "id": "6449c3204c3b0997b7ee80dcdc0abb3f3bf41857",
          "message": "chore: upgrade dependencies across examples and svelte editor\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T01:00:30-05:00",
          "tree_id": "4372fc2728dcba9339aa8c38465811d344a89975",
          "url": "https://github.com/jonattanva/luna-form/commit/6449c3204c3b0997b7ee80dcdc0abb3f3bf41857"
        },
        "date": 1775887320975,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 285,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 639,
            "unit": "ms"
          }
        ]
      },
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
          "id": "6575fc019b4158edd644c7ee9be4c7d088968e4b",
          "message": "feat(chips): add chips/month type and fix isChipsMonths checker\n\n- Add CHIPS_MONTHS constant and fix isChipsMonths to use it instead of CHIPS\n- Register chips/month in defineChips config\n- Inline defineSelect into buildCommon, removing one-line wrapper\n- Add store-helper unit tests for nested atoms, omitKey, clearAll, bulkReport\n- Upgrade turbo to 2.9.6\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-04-11T14:19:53-05:00",
          "tree_id": "0bc3d987c446b8c755e5b2b8b0a3cd38312cec12",
          "url": "https://github.com/jonattanva/luna-form/commit/6575fc019b4158edd644c7ee9be4c7d088968e4b"
        },
        "date": 1775935269087,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 277,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 610,
            "unit": "ms"
          }
        ]
      },
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
          "id": "71bc6fb95b6d73f52ebd4e97b502c3fae0156a93",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-11T14:28:15-05:00",
          "tree_id": "134a90896ae4262f96bddf5194eba8d7d843debb",
          "url": "https://github.com/jonattanva/luna-form/commit/71bc6fb95b6d73f52ebd4e97b502c3fae0156a93"
        },
        "date": 1775935757996,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 262,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 591,
            "unit": "ms"
          }
        ]
      },
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
          "id": "4bf11ff48370d1ca210dd7bda6c88a7577343ede",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T16:37:42-05:00",
          "tree_id": "b1bf6fa83b2c2d7c9e3120fe7a3d271a6ba3fb07",
          "url": "https://github.com/jonattanva/luna-form/commit/4bf11ff48370d1ca210dd7bda6c88a7577343ede"
        },
        "date": 1775943525580,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 623,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5e09c57057cdad6e075f9181a5debe56ce4af40e",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T16:44:05-05:00",
          "tree_id": "69df350ad435bc30adf68178a0f1143e2ed163b5",
          "url": "https://github.com/jonattanva/luna-form/commit/5e09c57057cdad6e075f9181a5debe56ce4af40e"
        },
        "date": 1775943909747,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 274,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 225,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f1605010274e04c1bde857f5cd72b08f1806404b",
          "message": "fix(ci): allow esbuild, sharp, unrs-resolver build scripts via pnpm onlyBuiltDependencies",
          "timestamp": "2026-04-11T17:10:52-05:00",
          "tree_id": "fbd84e430cb26941983ff270522fb1e97073191a",
          "url": "https://github.com/jonattanva/luna-form/commit/f1605010274e04c1bde857f5cd72b08f1806404b"
        },
        "date": 1775945511872,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 302,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 671,
            "unit": "ms"
          }
        ]
      },
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
          "id": "1624020ddd8ab3bcbf8e76c9c4837657f9617415",
          "message": "new input/date",
          "timestamp": "2026-04-13T19:02:07-05:00",
          "tree_id": "144bdca0b2dc60b89fd6db8e201e629ec0816824",
          "url": "https://github.com/jonattanva/luna-form/commit/1624020ddd8ab3bcbf8e76c9c4837657f9617415"
        },
        "date": 1776125024927,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 269,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 205,
            "unit": "ms"
          }
        ]
      },
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
          "id": "62f7045eead4e08d68647113679cf63042af7e6e",
          "message": "feat: default date format to MMMM d, yyyy and improved input handling",
          "timestamp": "2026-04-14T23:01:22-05:00",
          "tree_id": "c2dc5e0581e3bf72a43012d5900709c071356a6f",
          "url": "https://github.com/jonattanva/luna-form/commit/62f7045eead4e08d68647113679cf63042af7e6e"
        },
        "date": 1776225770974,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 258,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 567,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bc0392f58d506228bcf245c5622375bb8cad40a6",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-15T11:54:00-05:00",
          "tree_id": "feddd7b97bb2cbdbcf665712d9a2f63f288faa8c",
          "url": "https://github.com/jonattanva/luna-form/commit/bc0392f58d506228bcf245c5622375bb8cad40a6"
        },
        "date": 1776272120380,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 589,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a84486da9d1dc571a2976d7b215c9e9dec2f836f",
          "message": "feat: add timezone utilities and refactor input components\n\nIntroduce timezone data loading/compute utilities in luna-core and a\ntimezone input in luna-react. Split the input component into focused\nbase/create/dateable/selectable/textable modules with shared strategies\nand hooks. Fix e2e description locator to avoid strict-mode collision\nwith the code editor.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
          "timestamp": "2026-04-17T21:46:55-05:00",
          "tree_id": "f7fbbe304d9587b00546b496c6e62fa8e1162436",
          "url": "https://github.com/jonattanva/luna-form/commit/a84486da9d1dc571a2976d7b215c9e9dec2f836f"
        },
        "date": 1776480654799,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 283,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 626,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bc0392f58d506228bcf245c5622375bb8cad40a6",
          "message": "upgrade dev dependencies",
          "timestamp": "2026-04-15T11:54:00-05:00",
          "tree_id": "feddd7b97bb2cbdbcf665712d9a2f63f288faa8c",
          "url": "https://github.com/jonattanva/luna-form/commit/bc0392f58d506228bcf245c5622375bb8cad40a6"
        },
        "date": 1776531384130,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 283,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 647,
            "unit": "ms"
          }
        ]
      },
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
          "id": "dad979331a8ffc1b1f776a6f02fb107aeee8adca",
          "message": "upgrade version",
          "timestamp": "2026-04-19T21:58:03-05:00",
          "tree_id": "5796fd00ea9799919b1b82676a85c4e4da5c9e01",
          "url": "https://github.com/jonattanva/luna-form/commit/dad979331a8ffc1b1f776a6f02fb107aeee8adca"
        },
        "date": 1776653960469,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 266,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 605,
            "unit": "ms"
          }
        ]
      },
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
          "id": "be457a116105b57db967c487f7ec5264785c5c23",
          "message": "upgrade dependecies",
          "timestamp": "2026-04-29T21:49:08-05:00",
          "tree_id": "23615aef3a1f3f577b945cd22396ab20fab1bc28",
          "url": "https://github.com/jonattanva/luna-form/commit/be457a116105b57db967c487f7ec5264785c5c23"
        },
        "date": 1777517433493,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 261,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 599,
            "unit": "ms"
          }
        ]
      },
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
          "id": "835bc3983141736d4282123f4a6274c2c0c9142c",
          "message": "chore: update code",
          "timestamp": "2026-04-30T12:14:18-05:00",
          "tree_id": "b85ca64af298bb5a78b46e0b507721a582680b92",
          "url": "https://github.com/jonattanva/luna-form/commit/835bc3983141736d4282123f4a6274c2c0c9142c"
        },
        "date": 1777569347583,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 278,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 211,
            "unit": "ms"
          }
        ]
      },
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
          "id": "5d95326bb2e6a4fbb97d0070817e69aacb5cbb5b",
          "message": "new step componente",
          "timestamp": "2026-04-30T18:13:28-05:00",
          "tree_id": "af4ff742f60ccfbdb219f9582d444b43889dac44",
          "url": "https://github.com/jonattanva/luna-form/commit/5d95326bb2e6a4fbb97d0070817e69aacb5cbb5b"
        },
        "date": 1777590887042,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 281,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 588,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f644b339170a34d2a8347f175c1259cb3466f157",
          "message": "upgrade dependecies",
          "timestamp": "2026-04-30T18:27:55-05:00",
          "tree_id": "e0b4bc9cc10f77b811b2025ffca2bea381dc1012",
          "url": "https://github.com/jonattanva/luna-form/commit/f644b339170a34d2a8347f175c1259cb3466f157"
        },
        "date": 1777591761337,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 275,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 602,
            "unit": "ms"
          }
        ]
      },
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
          "id": "7d7e1a714fb95f33f74a01b063dba9efb229cfe7",
          "message": "feat: add collapsible and collapsed support to list items",
          "timestamp": "2026-05-01T16:38:59-05:00",
          "tree_id": "04884fddfb1d17e19dd8f2c3c5e8aa5a2de0ebaa",
          "url": "https://github.com/jonattanva/luna-form/commit/7d7e1a714fb95f33f74a01b063dba9efb229cfe7"
        },
        "date": 1777671619117,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 276,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 634,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a045de4a92d3f4d0e382a2beab62f36fbcfbebd5",
          "message": "chore: update pnpm-lock.yaml with tool updates",
          "timestamp": "2026-05-02T14:36:20-05:00",
          "tree_id": "ebd265db3dfd0c93331c14a7ba5027c1e809d941",
          "url": "https://github.com/jonattanva/luna-form/commit/a045de4a92d3f4d0e382a2beab62f36fbcfbebd5"
        },
        "date": 1777750654478,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 271,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 202,
            "unit": "ms"
          }
        ]
      },
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
          "id": "804fe6b53d31c0962b4c2c67b20bc651aff67707",
          "message": "ci: increase e2e-test timeout to 30 minutes",
          "timestamp": "2026-05-02T21:59:40-05:00",
          "tree_id": "02d4c92d32a61e39e965194fd2250044880e7dab",
          "url": "https://github.com/jonattanva/luna-form/commit/804fe6b53d31c0962b4c2c67b20bc651aff67707"
        },
        "date": 1777777258241,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 279,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 640,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b3d0c151456d0db8f86b19002e74e2f47816adb1",
          "message": "feat: implement generic Chips component and update luna-core types",
          "timestamp": "2026-05-04T12:18:58-05:00",
          "tree_id": "a4a21177912239d12136fc47e2a16978c7020cc1",
          "url": "https://github.com/jonattanva/luna-form/commit/b3d0c151456d0db8f86b19002e74e2f47816adb1"
        },
        "date": 1777915229644,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 274,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 603,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c451835cb7e100cc3e1518934f4cf832ce3e65be",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-04T12:51:33-05:00",
          "tree_id": "c84e6bea6756d3fcd91c725f1c875e0df2d343d5",
          "url": "https://github.com/jonattanva/luna-form/commit/c451835cb7e100cc3e1518934f4cf832ce3e65be"
        },
        "date": 1777917179511,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 271,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 648,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8536cb623a0be901e1916e89e72658a1a9c951a1",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-04T12:52:33-05:00",
          "tree_id": "b6ed43edb8a352b922b81f09db8fce3b0e7760ef",
          "url": "https://github.com/jonattanva/luna-form/commit/8536cb623a0be901e1916e89e72658a1a9c951a1"
        },
        "date": 1777917237065,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 603,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8d3189b47da2fa029090cf66192ea18c1f3c0555",
          "message": "refactor: optimize collapsible list headers and enhance list add button UI\n\n- Extract resolveValue into a shared utility to fix preview issues in collapsed items.\n- Enhance FieldList and FieldListItem styling (dashed borders, centered add button, space-between counter).\n- Improve collapsible header interaction: whole header is now clickable and underlies on hover.\n- Fix regression where previews in collapsed items would be empty on first render by falling back to initial values.\n- Update dependencies and bump package versions to 0.0.47.\n- Add comprehensive E2E tests for list add button and collapsible headers.",
          "timestamp": "2026-05-05T17:00:03-05:00",
          "tree_id": "e5eef55a0fe0495020ab0cbd0340d709bdb3e867",
          "url": "https://github.com/jonattanva/luna-form/commit/8d3189b47da2fa029090cf66192ea18c1f3c0555"
        },
        "date": 1778018499219,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 265,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 188,
            "unit": "ms"
          }
        ]
      },
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
          "id": "406d5540ef4eb80a9de00f8bd3c46c9bb3f08a65",
          "message": "fix: restore @perf tag to E2E Benchmark",
          "timestamp": "2026-05-07T22:48:48-05:00",
          "tree_id": "16cd0934ccc46ada588d14c4e1b6d25a880d1814",
          "url": "https://github.com/jonattanva/luna-form/commit/406d5540ef4eb80a9de00f8bd3c46c9bb3f08a65"
        },
        "date": 1778212209949,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 275,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 210,
            "unit": "ms"
          }
        ]
      },
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
          "id": "8a45dec49fe9d41537510319324559263a6454a3",
          "message": "feat: enhance schema validation and event documentation\n\n- Update luna-core to support array-based validation for chips and lists\n- Refactor useValue hook in luna-react to apply transforms during resolution\n- Add comprehensive documentation for the change event system (ValueEvent, StateEvent, SourceEvent)\n- Fix E2E tests related to date selection types (string to number)\n- Improve resolveValue to safely handle object traversal",
          "timestamp": "2026-05-08T10:44:32-05:00",
          "tree_id": "f321f00b2ff846b3d1eacdb4e044d12c1f4baaf1",
          "url": "https://github.com/jonattanva/luna-form/commit/8a45dec49fe9d41537510319324559263a6454a3"
        },
        "date": 1778255228458,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 287,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 662,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a1729ff78d6841d3d8ff08e44387da1a97a9e40a",
          "message": "fix(tests): resolve strict mode violation in steps spec",
          "timestamp": "2026-05-08T15:08:32-05:00",
          "tree_id": "6c056f2d67611dcd5e7b9e07bbb922733034f353",
          "url": "https://github.com/jonattanva/luna-form/commit/a1729ff78d6841d3d8ff08e44387da1a97a9e40a"
        },
        "date": 1778271007138,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 560,
            "unit": "ms"
          }
        ]
      },
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
          "id": "a3a84910f0a08cf4a989f4d98cf07a4be81a1e9c",
          "message": "test(e2e): fix flaky list-add-button hover test in firefox\n\n- enabled reducedMotion in playwright.config.ts\n- added motion-reduce:transition-none to AddButton\n- replaced hover({ force: true }) with dispatchEvent('mouseenter')\n- removed flaky setTimeout/raf waits in favour of reduced motion",
          "timestamp": "2026-05-08T15:46:22-05:00",
          "tree_id": "b646fe9bf34b40477079b6eb629d639aa60cfb67",
          "url": "https://github.com/jonattanva/luna-form/commit/a3a84910f0a08cf4a989f4d98cf07a4be81a1e9c"
        },
        "date": 1778273272462,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 292,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 707,
            "unit": "ms"
          }
        ]
      },
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
          "id": "bdb29e384aaf80104a0178460ff58dcf6c1b7d1a",
          "message": "fix(luna-react): disable transition on list add button for stable e2e testing",
          "timestamp": "2026-05-08T23:24:30-05:00",
          "tree_id": "7462c34d4e09a3285c162eefde036f841738ec96",
          "url": "https://github.com/jonattanva/luna-form/commit/bdb29e384aaf80104a0178460ff58dcf6c1b7d1a"
        },
        "date": 1778300741809,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 266,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 501,
            "unit": "ms"
          }
        ]
      },
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
          "id": "08e501c25d28a46677b13687ade0e4fa19ae78ac",
          "message": "fix(test): wait for hover styles in list-add-button e2e",
          "timestamp": "2026-05-08T23:52:33-05:00",
          "tree_id": "a9381db64be79d674a25c17255bd9218c9540992",
          "url": "https://github.com/jonattanva/luna-form/commit/08e501c25d28a46677b13687ade0e4fa19ae78ac"
        },
        "date": 1778302434527,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 262,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 620,
            "unit": "ms"
          }
        ]
      },
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
          "id": "b754720db2fa4b6a850d0d6c90dbdafde7ad11d8",
          "message": "refactor(tests): update e2e test tags format and remove unstable hover test",
          "timestamp": "2026-05-09T00:06:42-05:00",
          "tree_id": "54f78ea43aa7b052903d69968d3f018110b13e76",
          "url": "https://github.com/jonattanva/luna-form/commit/b754720db2fa4b6a850d0d6c90dbdafde7ad11d8"
        },
        "date": 1778303287638,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 280,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 614,
            "unit": "ms"
          }
        ]
      },
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
          "id": "aaeabca8f3429c5f38bcf0c0a74feb6dfadc8f97",
          "message": "format files",
          "timestamp": "2026-05-09T00:35:39-05:00",
          "tree_id": "716706fe0ae70a8a98f7e4862999a8e578089578",
          "url": "https://github.com/jonattanva/luna-form/commit/aaeabca8f3429c5f38bcf0c0a74feb6dfadc8f97"
        },
        "date": 1778305027101,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 283,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 220,
            "unit": "ms"
          }
        ]
      },
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
          "id": "d6ca7c2df0e3f8ee281af4935777a9e2db0cfaf9",
          "message": "feat: implement relative target resolution in list events using 'list/field' syntax and update docs",
          "timestamp": "2026-05-09T22:51:04-05:00",
          "tree_id": "0d2a0c3b6db83e8e03fcd8f92c0357bc9ab6fd34",
          "url": "https://github.com/jonattanva/luna-form/commit/d6ca7c2df0e3f8ee281af4935777a9e2db0cfaf9"
        },
        "date": 1778385165174,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 538,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 132,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c0e3503c845a49a7e35ede31551f6fa1542f9bf7",
          "message": "feat: add conditional interpolation and liquid format filters\n\n- Implement date and currency formatting for interpolation\n- Add conditional rendering for list items and descriptions\n- Update state handling for events\n- Add e2e and unit tests for new features",
          "timestamp": "2026-05-11T08:26:56-05:00",
          "tree_id": "ee9206d9526c7ea560c9e1cbed49a8d20fba6e74",
          "url": "https://github.com/jonattanva/luna-form/commit/c0e3503c845a49a7e35ede31551f6fa1542f9bf7"
        },
        "date": 1778506117839,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 213,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 472,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f93c5aec03e3c6176323244f989d952120bae471",
          "message": "fix(luna-react): resolve value hydration in InputBase and add E2E tests for onlyIfTargetEmpty",
          "timestamp": "2026-05-11T12:07:31-05:00",
          "tree_id": "808c0118ee6198eaea01f00e4816a0c20b27300e",
          "url": "https://github.com/jonattanva/luna-form/commit/f93c5aec03e3c6176323244f989d952120bae471"
        },
        "date": 1778519352586,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 290,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 648,
            "unit": "ms"
          }
        ]
      },
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
          "id": "785039e2b646ccc04a5f9a6030081dce1a5f4053",
          "message": "chore: formatting and package updates",
          "timestamp": "2026-05-11T18:14:32-05:00",
          "tree_id": "5dac4503d6fc013e936c392c12be17988be895f9",
          "url": "https://github.com/jonattanva/luna-form/commit/785039e2b646ccc04a5f9a6030081dce1a5f4053"
        },
        "date": 1778541343742,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 262,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 198,
            "unit": "ms"
          }
        ]
      },
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
          "id": "69e1f0f2214fefdcb41fddf5376af68f28acbf1f",
          "message": "docs: remove deprecated collapsible property from list field and update types",
          "timestamp": "2026-05-11T22:11:48-05:00",
          "tree_id": "7fb26dc27d715b820c2e923623e88caada13222e",
          "url": "https://github.com/jonattanva/luna-form/commit/69e1f0f2214fefdcb41fddf5376af68f28acbf1f"
        },
        "date": 1778555589395,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 279,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 617,
            "unit": "ms"
          }
        ]
      },
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
          "id": "f657ac7f184bfb0839a7e2c77f4d7aff4f671fd6",
          "message": "feat: add reactive preview label conditions for list items and bump versions to 0.0.50",
          "timestamp": "2026-05-12T11:28:19-05:00",
          "tree_id": "5aa15ebe9f2fb291b845bd962aee26010eb4d61d",
          "url": "https://github.com/jonattanva/luna-form/commit/f657ac7f184bfb0839a7e2c77f4d7aff4f671fd6"
        },
        "date": 1778603571058,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 278,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 631,
            "unit": "ms"
          }
        ]
      },
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
          "id": "d58eebeb771c928a55574b8a50c9fb9555b19277",
          "message": "ci: increase e2e test timeout to 60 minutes",
          "timestamp": "2026-05-12T15:21:28-05:00",
          "tree_id": "29699c8b625aa63d7ce7d31a51fc8af2d9c7979d",
          "url": "https://github.com/jonattanva/luna-form/commit/d58eebeb771c928a55574b8a50c9fb9555b19277"
        },
        "date": 1778617360602,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 360,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 251,
            "unit": "ms"
          }
        ]
      },
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
          "id": "049f1d18dd79fc0827f7994b51a8d1014b6bb503",
          "message": "chore: reduce benchmark noise by increasing iterations and relaxing thresholds",
          "timestamp": "2026-05-12T17:21:28-05:00",
          "tree_id": "0cf720b5a9cefa05102c1d74cd6d4a725e7c1bc0",
          "url": "https://github.com/jonattanva/luna-form/commit/049f1d18dd79fc0827f7994b51a8d1014b6bb503"
        },
        "date": 1778624566250,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 265,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 609,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ae37df7417e08d82615fd0a34f48ebe9b98d370b",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-14T11:37:49-05:00",
          "tree_id": "0443196f5ded5f819fa32fee96456b7bc85b2ebf",
          "url": "https://github.com/jonattanva/luna-form/commit/ae37df7417e08d82615fd0a34f48ebe9b98d370b"
        },
        "date": 1778776767728,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 639,
            "unit": "ms"
          }
        ]
      },
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
          "id": "ee583f7b66f4efb62241b284646651c5b0e9165a",
          "message": "upgrade dependecies",
          "timestamp": "2026-05-14T12:37:47-05:00",
          "tree_id": "0db436d54845b66d06afdfa95e81e7e7f1fc1559",
          "url": "https://github.com/jonattanva/luna-form/commit/ee583f7b66f4efb62241b284646651c5b0e9165a"
        },
        "date": 1778780359058,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 613,
            "unit": "ms"
          }
        ]
      },
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
          "id": "c5dc8d96de70f39553768e08b80c08e6a3b06d8c",
          "message": "chore: update packages and add new e2e test",
          "timestamp": "2026-05-14T14:27:58-05:00",
          "tree_id": "0e020bd4276932a063b8e76710d05ca298151912",
          "url": "https://github.com/jonattanva/luna-form/commit/c5dc8d96de70f39553768e08b80c08e6a3b06d8c"
        },
        "date": 1778786953922,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 260,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 491,
            "unit": "ms"
          }
        ]
      },
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
          "id": "52853f0d62e13c92b720e6e5e494c9bc4f5a4579",
          "message": "fix(core): improve value-event autofill handling and update dependencies",
          "timestamp": "2026-05-14T22:27:26-05:00",
          "tree_id": "a6937280c510711ee8017fff3b6d1d1fda77404b",
          "url": "https://github.com/jonattanva/luna-form/commit/52853f0d62e13c92b720e6e5e494c9bc4f5a4579"
        },
        "date": 1778815729629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 250,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 185,
            "unit": "ms"
          }
        ]
      },
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
          "id": "0948ac0d671737003f703b1b45338d9c8c94f16d",
          "message": "fix: support array conditions, improve auto-fill handling, and clear hidden field values",
          "timestamp": "2026-05-19T18:43:57-05:00",
          "tree_id": "325f165129a4168e208655a2a382827e9f100370",
          "url": "https://github.com/jonattanva/luna-form/commit/0948ac0d671737003f703b1b45338d9c8c94f16d"
        },
        "date": 1779234317629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 264,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 193,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}