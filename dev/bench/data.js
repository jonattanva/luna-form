window.BENCHMARK_DATA = {
  "lastUpdate": 1776124985117,
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
      }
    ]
  }
}