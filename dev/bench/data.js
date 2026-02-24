window.BENCHMARK_DATA = {
  "lastUpdate": 1771967076950,
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
      }
    ]
  }
}