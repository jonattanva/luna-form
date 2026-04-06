window.BENCHMARK_DATA = {
  "lastUpdate": 1775518451486,
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
      }
    ]
  }
}