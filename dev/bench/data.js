window.BENCHMARK_DATA = {
  "lastUpdate": 1789884176115,
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
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "572c11783ea0d4239321d83fb1e7ea7fbc9bf06d",
          "message": "docs: update and expand field documentation including select, specialized selectors and markdown support",
          "timestamp": "2026-05-20T19:52:53-05:00",
          "tree_id": "7f4325a787a7f282f855c70f7149c3204e2e4f61",
          "url": "https://github.com/jonattanva/luna-form/commit/572c11783ea0d4239321d83fb1e7ea7fbc9bf06d"
        },
        "date": 1779324820148,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00026779589999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00089229468,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.025894082080000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003302201200000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00046551680000000035,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.022212677400000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ab99b00c45af2cc8a3bc2f5a9d17769d7fd82448",
          "message": "fix(react): apply defaultValue silently to avoid skipping first user change and update CI workflow concurrency",
          "timestamp": "2026-05-22T09:38:52-05:00",
          "tree_id": "a3da0df5c8b23cf106f910b61ea3253c6e437041",
          "url": "https://github.com/jonattanva/luna-form/commit/ab99b00c45af2cc8a3bc2f5a9d17769d7fd82448"
        },
        "date": 1779460796490,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034874296000000015,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011290428199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03521884636,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040682213999999477,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005731487199999992,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030249271360000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c65ce54f0c91792090d6bfb500e6adc4a4d18169",
          "message": "fix(react): apply defaultValue silently in onCurrentValueChange fallback\n\nWhen the form receives a value prop that does not include this specific\nfield but the field has a defaultValue, the fallback inside\nonCurrentValueChange armed the skip flag on mount, causing the first\nuser interaction to be silently dropped on select/active and other\nSelectable-strategy fields (chips, etc.).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
          "timestamp": "2026-05-22T16:13:03-05:00",
          "tree_id": "f6ffa5505fba750e7b1a1b8fda1c9a01a1271e75",
          "url": "https://github.com/jonattanva/luna-form/commit/c65ce54f0c91792090d6bfb500e6adc4a4d18169"
        },
        "date": 1779484446319,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037069132000000027,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011604510399999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.032873493139999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042093509999999694,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006004685599999993,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0283666521,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "7e7eb979f883e1605f52d62d5ccbad0241389c20",
          "message": "fix chips double selection",
          "timestamp": "2026-05-28T20:27:59-05:00",
          "tree_id": "517acedc083304dce4ec4b7cd906be65f9d5d418",
          "url": "https://github.com/jonattanva/luna-form/commit/7e7eb979f883e1605f52d62d5ccbad0241389c20"
        },
        "date": 1780018137419,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036709614000000044,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011366218999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03578252388,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041697975999999473,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005780925599999955,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0311499565,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "359664cea9aa041027f4d51d311871ba5ea0d676",
          "message": "Merge pull request #38 from jonattanva/fix/list-remove-nonlast-hydrated-item\n\nfix(react): list keeps trailing item value on non-last removal",
          "timestamp": "2026-06-01T10:14:40-05:00",
          "tree_id": "e67ae60ef45b50658413cf304de0c61881bf1eab",
          "url": "https://github.com/jonattanva/luna-form/commit/359664cea9aa041027f4d51d311871ba5ea0d676"
        },
        "date": 1780326933220,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035205491999999933,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00114192498,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03393920958,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043316687999999883,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006000298199999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02817051082,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "15c576f2034e315ab525d5f5bde89a9d59e28dac",
          "message": "Merge pull request #39 from jonattanva/fix/grid-alignment-truncation\n\nfeat(luna-react): improve grid alignment with label truncation",
          "timestamp": "2026-06-01T18:18:04-05:00",
          "tree_id": "46326772d693068ff326708d65282d33fed8927b",
          "url": "https://github.com/jonattanva/luna-form/commit/15c576f2034e315ab525d5f5bde89a9d59e28dac"
        },
        "date": 1780355924503,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034821003999999957,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011387122,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0332940661,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004183523200000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005899257399999988,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028118281019999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c976f9b6bf44b412e847a67fb83d056f36a83a8f",
          "message": "fix list",
          "timestamp": "2026-06-01T20:30:52-05:00",
          "tree_id": "4bbf12e245066f8d3a476a0796b7de9fb7557048",
          "url": "https://github.com/jonattanva/luna-form/commit/c976f9b6bf44b412e847a67fb83d056f36a83a8f"
        },
        "date": 1780363900265,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003458989400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011420238200000007,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03338201626,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000432066420000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000634967259999994,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02862657902,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "1eb19d48002de67568788b80e995dd3377376497",
          "message": "upgrade dependencies",
          "timestamp": "2026-06-01T22:11:02-05:00",
          "tree_id": "eafe10d1700c03edbd39cc38a6b06250460fa53e",
          "url": "https://github.com/jonattanva/luna-form/commit/1eb19d48002de67568788b80e995dd3377376497"
        },
        "date": 1780369919681,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034297483999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00113145804,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036472215499999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00045095847999999933,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006492418399999952,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03175761511999999,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "669ee12ec8312f5b5e84c6f68c164792a16104e2",
          "message": "fix list",
          "timestamp": "2026-06-02T10:26:36-05:00",
          "tree_id": "4840088e85c23a929ca3a6615d8ed8ba95746f8e",
          "url": "https://github.com/jonattanva/luna-form/commit/669ee12ec8312f5b5e84c6f68c164792a16104e2"
        },
        "date": 1780414063159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037505047999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010991242,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.040401397,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004541074199999912,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006330841199999941,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03449368190000001,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "cba7adea2b0e6ee9ac514d0063e92a3a49495f67",
          "message": "fix list",
          "timestamp": "2026-06-02T10:27:06-05:00",
          "tree_id": "d4b5b41d1be4c2780c3b0455889f7cc7e2397026",
          "url": "https://github.com/jonattanva/luna-form/commit/cba7adea2b0e6ee9ac514d0063e92a3a49495f67"
        },
        "date": 1780414096528,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035243718,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011561420999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03622539862,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000416931280000008,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005819408800000019,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03150699022000001,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b02f4d7eae7c93a60a80fb51102a85572df7fb7b",
          "message": "fix list",
          "timestamp": "2026-06-02T10:39:26-05:00",
          "tree_id": "299233cb829dd129ac9f5217b6e0c32ff5bec51b",
          "url": "https://github.com/jonattanva/luna-form/commit/b02f4d7eae7c93a60a80fb51102a85572df7fb7b"
        },
        "date": 1780414820204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003335597000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011101612800000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03561777628,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040281645999999454,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005594757200000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03034359066,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "783588b5675ac1cdf22a4b81d8374d47a182fa16",
          "message": "fix error with value",
          "timestamp": "2026-06-10T08:58:35-05:00",
          "tree_id": "90204582a305338a8d95fd2ad329b111b0037f28",
          "url": "https://github.com/jonattanva/luna-form/commit/783588b5675ac1cdf22a4b81d8374d47a182fa16"
        },
        "date": 1781099970766,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035132409999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011462483200000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03544475726,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041551541999999245,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000570756339999998,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030060306000000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "5b1b0958ea24b15b17f740fc5147464975e53249",
          "message": "fix error with value",
          "timestamp": "2026-06-10T09:07:39-05:00",
          "tree_id": "04f99b5f68f36a8e62abf4621785ea00c7132b8a",
          "url": "https://github.com/jonattanva/luna-form/commit/5b1b0958ea24b15b17f740fc5147464975e53249"
        },
        "date": 1781100504416,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003674700800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011599251400000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0339068842,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00045375191999999514,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006241416800000024,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028571644260000004,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "d0169698b8af89d6564bc57f1e7a040a59e71ea3",
          "message": "new property in input type list",
          "timestamp": "2026-06-18T10:20:44-05:00",
          "tree_id": "b60f23975866fb72a7a13339954e71326fa4697a",
          "url": "https://github.com/jonattanva/luna-form/commit/d0169698b8af89d6564bc57f1e7a040a59e71ea3"
        },
        "date": 1781796101614,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033852059999999937,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00113143108,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036009054900000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004177919600000041,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005788447999999971,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030969608979999994,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "8c90a743ac6d13246309b9d0a84a0f377998b85d",
          "message": "fix tests",
          "timestamp": "2026-06-18T10:46:16-05:00",
          "tree_id": "31df68e86371030191f23b6511c00b3f74cd98c3",
          "url": "https://github.com/jonattanva/luna-form/commit/8c90a743ac6d13246309b9d0a84a0f377998b85d"
        },
        "date": 1781797637981,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036838797999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011350436999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03545887142,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041123795999999856,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005804650200000015,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03017538348,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "dfcc19b3ab9e808888a0a8ed52c2290bf7180d88",
          "message": "fix list",
          "timestamp": "2026-06-20T13:22:26-05:00",
          "tree_id": "dee85955c6788e2cc475fe4aa079b7e6cb639bda",
          "url": "https://github.com/jonattanva/luna-form/commit/dfcc19b3ab9e808888a0a8ed52c2290bf7180d88"
        },
        "date": 1781979809602,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037119092000000026,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00111392388,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03828810324,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004415942600000017,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006439940000000024,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03268316738,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "67028e4d33317c662e66f20e707f37e8662c1441",
          "message": "fix list",
          "timestamp": "2026-06-20T13:25:20-05:00",
          "tree_id": "0b32b138143ff645f718d0501eab5db9d2f66ad1",
          "url": "https://github.com/jonattanva/luna-form/commit/67028e4d33317c662e66f20e707f37e8662c1441"
        },
        "date": 1781979974499,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033894780000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011213458600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03567877984,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040643592000000355,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000574886919999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0303201058,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "0ef0640780905fa7e31eb621ccbf0f15ce61acd2",
          "message": "fix error select",
          "timestamp": "2026-07-02T22:43:04-05:00",
          "tree_id": "112d98d2f2b51df8984bb821d08d8ad9317cbec6",
          "url": "https://github.com/jonattanva/luna-form/commit/0ef0640780905fa7e31eb621ccbf0f15ce61acd2"
        },
        "date": 1783050243831,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034002054000000046,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011146943599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0362671267,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004139305000000058,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005965451600000051,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03098420282,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bc510fb2f31ea7b72999417f7fc690daf858aa26",
          "message": "Merge pull request #40 from jonattanva/feat/headless-form-schema\n\nHeadless form schema + declarative validation vocabulary",
          "timestamp": "2026-07-10T14:43:14-05:00",
          "tree_id": "e7887a7e5da5d7210be0d7cd19a9ff819aca017a",
          "url": "https://github.com/jonattanva/luna-form/commit/bc510fb2f31ea7b72999417f7fc690daf858aa26"
        },
        "date": 1783712649707,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034685275999999987,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011505033200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.037144688520000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004240261800000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006825330000000031,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03188117719999999,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "62047155a3fc520f0b0f536e920a0635bc46f4e2",
          "message": "Merge pull request #41 from jonattanva/feat/nested-hidden-expression-schema\n\nfeat(schema): nested dotted names, @-expression patterns, hidden-awareness (0.0.70)",
          "timestamp": "2026-07-10T22:33:38-05:00",
          "tree_id": "31389d9d2cf03f035d2a753e6e7f734d64ddd607",
          "url": "https://github.com/jonattanva/luna-form/commit/62047155a3fc520f0b0f536e920a0635bc46f4e2"
        },
        "date": 1783740873318,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034714403999999943,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00113196824,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.035882576480000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004060526000000027,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005766348599999946,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03106791048,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "4008e2ac1c5ccf6adc0b17928328a55f72f4517e",
          "message": "fix tests",
          "timestamp": "2026-07-11T11:41:00-05:00",
          "tree_id": "7f3df7eaae87727a2f3f569f5600f1eaef8053c2",
          "url": "https://github.com/jonattanva/luna-form/commit/4008e2ac1c5ccf6adc0b17928328a55f72f4517e"
        },
        "date": 1783788110995,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00026981352000000013,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008884433200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02584019578,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003291166599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004638137400000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02212392382,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "fd2c2be44af1419b04a71848b51ed9795a8f972e",
          "message": "fix tests",
          "timestamp": "2026-07-11T12:33:04-05:00",
          "tree_id": "c64473d8cac86ea364789cb74f64f3a8343e00e3",
          "url": "https://github.com/jonattanva/luna-form/commit/fd2c2be44af1419b04a71848b51ed9795a8f972e"
        },
        "date": 1783791246701,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002843570799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008957349199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02603897042,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003321971799999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004704845400000022,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.022557199980000005,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fe2c6e2573d533aa0f0006d42883125c0af290cf",
          "message": "Merge pull request #43 from jonattanva/feat/empty-operator-self-contained-types\n\nfeat: `empty` operator + self-contained schema types (0.0.72)",
          "timestamp": "2026-07-11T13:18:03-05:00",
          "tree_id": "99c5d2c03b021a5c0c9134d6a8582d260e40f0f2",
          "url": "https://github.com/jonattanva/luna-form/commit/fe2c6e2573d533aa0f0006d42883125c0af290cf"
        },
        "date": 1783793934420,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003170812599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010259878999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03324582238,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003788559199999963,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005453148800000054,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02704996023999999,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "16d243217cba51e85af73dab72b6f7aff4500437",
          "message": "Merge pull request #42 from jonattanva/fix/self-contained-schema-types\n\nfix(types): self-contained declarations (react-luna-form/schema no longer resolves to any) (0.0.71)",
          "timestamp": "2026-07-11T13:23:02-05:00",
          "tree_id": "99c5d2c03b021a5c0c9134d6a8582d260e40f0f2",
          "url": "https://github.com/jonattanva/luna-form/commit/16d243217cba51e85af73dab72b6f7aff4500437"
        },
        "date": 1783794217945,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037105546,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011441959999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036595866100000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041929802000000564,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000590099739999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03143290538,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29adaf5015234011ac7425e6ea6a226bad478686",
          "message": "Merge pull request #44 from jonattanva/fix/fields-union-types-0.0.73\n\nfix types",
          "timestamp": "2026-07-11T14:25:24-05:00",
          "tree_id": "37d64600fe232c294f01d07127c84d38e2c8a285",
          "url": "https://github.com/jonattanva/luna-form/commit/29adaf5015234011ac7425e6ea6a226bad478686"
        },
        "date": 1783797971962,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00039794144000000016,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0012583354199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03294367754,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004340807000000041,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006000354599999991,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02941127982,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "5510462c18c1ae29d734a3146198864e29ee3f48",
          "message": "upgrade dependencies",
          "timestamp": "2026-07-11T14:40:33-05:00",
          "tree_id": "c6e38c4d59ad1cd192c3f23bdebf4ba43f19f21d",
          "url": "https://github.com/jonattanva/luna-form/commit/5510462c18c1ae29d734a3146198864e29ee3f48"
        },
        "date": 1783798889362,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003434196000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011261378000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03640615534,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041254194000000095,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000597252980000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.031191864860000005,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f89ed82299b7ae98093b3993ae53825d87949950",
          "message": "Merge pull request #49 from jonattanva/feat/translate-array-source-options\n\nfeat(source): translate option labels for array sources",
          "timestamp": "2026-08-01T23:29:39-05:00",
          "tree_id": "ba8335a5bf470f0b1f91f4d5e95b7dc0d4340105",
          "url": "https://github.com/jonattanva/luna-form/commit/f89ed82299b7ae98093b3993ae53825d87949950"
        },
        "date": 1785645032231,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033191638000000013,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011207283200000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03697516612,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004355084600000009,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000659346660000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030777542360000007,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "987649b543ee1ac1ba34b881c2e256bd260adeea",
          "message": "Merge pull request #45 from jonattanva/fix/section-translation\n\nFix/section translation",
          "timestamp": "2026-08-01T23:38:04-05:00",
          "tree_id": "dbceddff403963f0c45874ed32bd2ac47ddb5e33",
          "url": "https://github.com/jonattanva/luna-form/commit/987649b543ee1ac1ba34b881c2e256bd260adeea"
        },
        "date": 1785645533997,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003657397600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011852592399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.037123257119999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043319878000000245,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005910601800000041,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03104408486,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3e61236a026f65e070993d036e1b080ee1e4a394",
          "message": "Merge pull request #50 from jonattanva/feat/locale-aware-specialized-selectors\n\nfeat(selectors): resolve built-in option labels through the form language",
          "timestamp": "2026-08-01T23:38:02-05:00",
          "tree_id": "e993338469b81cbb0e377d464895a7947602cfe8",
          "url": "https://github.com/jonattanva/luna-form/commit/3e61236a026f65e070993d036e1b080ee1e4a394"
        },
        "date": 1785645537014,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033809128000000045,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00113572902,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03675935038,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041754594,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005851191000000017,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030850743519999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2525ad2c64f500d6482f8e62fe2ba3575ff515da",
          "message": "Merge pull request #51 from jonattanva/fix/benchmark-gh-pages-fetch\n\nfix(ci): stop the browser benchmark from refetching gh-pages",
          "timestamp": "2026-08-02T00:20:12-05:00",
          "tree_id": "09f3843251bb8479cc8e8009991c6dbfe177db72",
          "url": "https://github.com/jonattanva/luna-form/commit/2525ad2c64f500d6482f8e62fe2ba3575ff515da"
        },
        "date": 1785648062222,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00023174401999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007778357399999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.023689529539999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002694928200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00038992201999999906,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01892867146,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "fa75fba7d5ce464b29f86723dfd028e912c8643a",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-02T00:29:54-05:00",
          "tree_id": "a5df4033a8e96fd91c70e1d1a8dcd109e7721bd9",
          "url": "https://github.com/jonattanva/luna-form/commit/fa75fba7d5ce464b29f86723dfd028e912c8643a"
        },
        "date": 1785648645155,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035968841999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011686530199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0359176739,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004092916200000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005943544600000041,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030469020540000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "860fecff25e23b8531b43b4b46156be5ba96f1ee",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-02T01:21:54-05:00",
          "tree_id": "ced36329ee19b6b51e08d31cca3dc3c73e6c2662",
          "url": "https://github.com/jonattanva/luna-form/commit/860fecff25e23b8531b43b4b46156be5ba96f1ee"
        },
        "date": 1785651781152,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037654999999999975,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0012668935,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03803850404,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004135681999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005889506400000027,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.031013106639999996,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a8ece23edf88f8cd003335a0ca31f3fc3cf4d600",
          "message": "Merge pull request #52 from jonattanva/feat/built-in-translations\n\nfeat(translations): resolve the library's own copy through the dictionary",
          "timestamp": "2026-08-02T21:11:28-05:00",
          "tree_id": "67ed2cdb8cd22ced323b6d50c8a5edc536e54b44",
          "url": "https://github.com/jonattanva/luna-form/commit/a8ece23edf88f8cd003335a0ca31f3fc3cf4d600"
        },
        "date": 1785723143193,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003713666800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011508408600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0372067417,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042161839999999755,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005937549599999965,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030147087019999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5398374c29c771fb4abe1ced646301ebad628e97",
          "message": "Merge pull request #53 from jonattanva/fix/value-event-focused-target\n\nfix(events): postpone an auto-fill into the field that has focus",
          "timestamp": "2026-08-03T09:30:48-05:00",
          "tree_id": "8707cff397ae8d01cbbc586d54e8fa178fbe3118",
          "url": "https://github.com/jonattanva/luna-form/commit/5398374c29c771fb4abe1ced646301ebad628e97"
        },
        "date": 1785767508835,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003763910199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011795971200000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03666905138,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041672583999999914,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005914989400000013,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030623327679999993,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ef84050759f7c40de86ca479445e0debef662a67",
          "message": "upgrade version",
          "timestamp": "2026-08-03T09:45:28-05:00",
          "tree_id": "f91fd40554bd3f6fd96710e707a401c6049ca2c8",
          "url": "https://github.com/jonattanva/luna-form/commit/ef84050759f7c40de86ca479445e0debef662a67"
        },
        "date": 1785768393167,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00042700855999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.001420123,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.038654895800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0005028657999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006993351600000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0334065287,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "061c4b1de9921d72983ea1569e9c006ac5de09a2",
          "message": "Merge pull request #54 from jonattanva/fix/value-event-off-the-transition\n\nfix(events): take the auto-fill write off the transition",
          "timestamp": "2026-08-03T14:37:29-05:00",
          "tree_id": "088a81aae59ffbfbbaf415943b6631fb14d689e6",
          "url": "https://github.com/jonattanva/luna-form/commit/061c4b1de9921d72983ea1569e9c006ac5de09a2"
        },
        "date": 1785785906399,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003473040800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00119078238,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036868713399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004300847200000044,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006025006200000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030126986779999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b4bc9394c4e3a0e28c90d1c1302220753f4e8f7c",
          "message": "upgrade version",
          "timestamp": "2026-08-03T15:33:40-05:00",
          "tree_id": "ce8c5963b2bc05a005f0046b84cbc426cd1d29af",
          "url": "https://github.com/jonattanva/luna-form/commit/b4bc9394c4e3a0e28c90d1c1302220753f4e8f7c"
        },
        "date": 1785789283544,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003482644799999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00118592512,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0361031026,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042178930000000037,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006211410800000067,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030759533600000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51189b9dfc99ac440946d246a79d10f11dd17ccd",
          "message": "Merge pull request #55 from jonattanva/fix/empty-value-from-value-prop\n\nfix(value): empty a form from the value prop, and ship the submit summary",
          "timestamp": "2026-08-04T10:27:13-05:00",
          "tree_id": "e7d0d74347eea8ceb5d0de65ca148b00f3512438",
          "url": "https://github.com/jonattanva/luna-form/commit/51189b9dfc99ac440946d246a79d10f11dd17ccd"
        },
        "date": 1785857306161,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003483755399999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011612088399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036552456239999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004205137399999967,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000591041239999995,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030520950039999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "718ea3d96a2b62ec265cd65b12128f05700f0a22",
          "message": "Merge pull request #56 from jonattanva/feat/interpolate-whole-placeholder\n\nfeat(list): let a value change event assign a list",
          "timestamp": "2026-08-12T11:05:07-05:00",
          "tree_id": "a0bf0904b35a672cf3bc78b934b3d54c8ae5240e",
          "url": "https://github.com/jonattanva/luna-form/commit/718ea3d96a2b62ec265cd65b12128f05700f0a22"
        },
        "date": 1786550761840,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003760954799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011120002599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03392057304,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004216049000000021,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005905119599999944,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02856978494,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ada296b5a8467c306d76569dbda5d9b76fd881eb",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-12T11:13:26-05:00",
          "tree_id": "82872d50486a75261baf5abc2a0072cfe078dead",
          "url": "https://github.com/jonattanva/luna-form/commit/ada296b5a8467c306d76569dbda5d9b76fd881eb"
        },
        "date": 1786551250969,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00024247157999999984,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007160466200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.023571662420000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002775315799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003957691199999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01899960538,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0e9dd1cf951c049d47145c42efeb38f23db17c92",
          "message": "Merge pull request #57 from jonattanva/fix/nested-list-outer-clobber\n\nfix(list): read a nested list from the list, not from a snapshot",
          "timestamp": "2026-08-14T08:21:32-05:00",
          "tree_id": "8e36d437ce2686316579d19e85a6a23d00d9521d",
          "url": "https://github.com/jonattanva/luna-form/commit/0e9dd1cf951c049d47145c42efeb38f23db17c92"
        },
        "date": 1786713751502,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003625904600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011508005000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03721654188,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004255751400000008,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006088289399999939,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.031446075059999995,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6f6c04c4af4ba92599be2c483fc63fe02b1a8383",
          "message": "Merge pull request #58 from jonattanva/fix/nested-list-value-assignment\n\nfix(list): assign the lists inside the rows, not just the rows",
          "timestamp": "2026-08-15T14:15:38-05:00",
          "tree_id": "fbbd53bd0947d5b0838e0f15b1d7630d10c65e40",
          "url": "https://github.com/jonattanva/luna-form/commit/6f6c04c4af4ba92599be2c483fc63fe02b1a8383"
        },
        "date": 1786821397819,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037954176000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011200427400000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.032753444640000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004407843199999934,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006223824799999966,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028938872840000004,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "e039ec268808042284a395e489baf55f9d57f94e",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-17T12:25:53-05:00",
          "tree_id": "55126e016eb5385103d0119f745add69693c441a",
          "url": "https://github.com/jonattanva/luna-form/commit/e039ec268808042284a395e489baf55f9d57f94e"
        },
        "date": 1786987609031,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003555341999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011093931000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0336386077,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043335183999999573,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006167554999999993,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028099442520000004,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "044fc116d72a3889e7ce6a58b6581c4ab0c04414",
          "message": "Merge pull request #59 from jonattanva/docs/ship-docs-in-package\n\ndocs: ship the form documentation inside the package",
          "timestamp": "2026-08-24T22:08:40-05:00",
          "tree_id": "de74c26b8069c9eb5e3459a14ecc275d79cde50f",
          "url": "https://github.com/jonattanva/luna-form/commit/044fc116d72a3889e7ce6a58b6581c4ab0c04414"
        },
        "date": 1787627365827,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003763054599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011142553400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03284868986,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004168693400000029,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006183201000000008,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028679659379999993,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "883efe9b0a3b95397255e6615f9ecd9b98a330e0",
          "message": "Merge pull request #60 from jonattanva/fix/checkbox-default-checked\n\nfix(checkbox): read the default by truthiness, not by presence",
          "timestamp": "2026-08-25T08:29:26-05:00",
          "tree_id": "5445e1bd2da2d1122b3de237b79612dda74ec442",
          "url": "https://github.com/jonattanva/luna-form/commit/883efe9b0a3b95397255e6615f9ecd9b98a330e0"
        },
        "date": 1787664617726,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002988669599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008249026199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02757000942,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003210733600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00046523041999999807,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023011763920000004,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8873761e5e3b8ed7f3ae1eff3c065042bd531bbb",
          "message": "Merge pull request #63 from jonattanva/chore/knip-entry-exports\n\nchore(core): let knip see luna-core, and clear what it found",
          "timestamp": "2026-08-25T09:14:43-05:00",
          "tree_id": "812b172f326a8c852015df79a8244fe62204a315",
          "url": "https://github.com/jonattanva/luna-form/commit/8873761e5e3b8ed7f3ae1eff3c065042bd531bbb"
        },
        "date": 1787667336080,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027677406000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008240093400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02745183168,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003327737200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004475363600000037,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023014410399999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ef8d8398826b4fa03f75162ff0f12bb5ffea963e",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-25T09:56:44-05:00",
          "tree_id": "cfd938a239435b75e1e10817f6949f94f1a5381d",
          "url": "https://github.com/jonattanva/luna-form/commit/ef8d8398826b4fa03f75162ff0f12bb5ffea963e"
        },
        "date": 1787669861904,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003504578799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009805953599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.032448388259999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003757382000000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005109957000000031,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.027545735199999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cb97e89c172e207b4e029637563d5bf9d2cd2181",
          "message": "Merge pull request #64 from jonattanva/fix/chips-mount-change-events\n\nfix(chips): match a `when` against the array, not against its text",
          "timestamp": "2026-08-27T07:36:11-05:00",
          "tree_id": "b6125843c6c03f30c89478634c307e8bbf45ff02",
          "url": "https://github.com/jonattanva/luna-form/commit/cb97e89c172e207b4e029637563d5bf9d2cd2181"
        },
        "date": 1787834226055,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003558126399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011271815200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03305283244,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004231290199999967,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006051503199999933,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028835043939999996,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "0cfb801099bf2d5d0aed5251220d2c0783497a45",
          "message": "upgrade dependencie",
          "timestamp": "2026-08-27T14:07:47-05:00",
          "tree_id": "5532013d41ce7b3ab1bf8c9747e446237ae5d523",
          "url": "https://github.com/jonattanva/luna-form/commit/0cfb801099bf2d5d0aed5251220d2c0783497a45"
        },
        "date": 1787857730786,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003756066800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011352949599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.032822277239999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004360115599999972,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006092637800000011,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02868887826,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "55b221c0be7944122d99922e956d0e0f5ea8092f",
          "message": "Merge pull request #66 from jonattanva/fix/state-hidden-clear-reported\n\nfix(state): report the clear when a state action hides a field",
          "timestamp": "2026-08-27T22:55:10-05:00",
          "tree_id": "1f27e65a8dc14732d1cfeb02f3ecb3e5ca71be2f",
          "url": "https://github.com/jonattanva/luna-form/commit/55b221c0be7944122d99922e956d0e0f5ea8092f"
        },
        "date": 1787889366871,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003510022600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010949367999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036549544239999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000417651620000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006036718199999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03119695716,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca352b013e8c17115e0139026780e8e5f7cd7da4",
          "message": "Merge pull request #68 from jonattanva/chore/bundle-size-comment-non-fatal\n\nci: let a failed bundle-size comment stop failing the build",
          "timestamp": "2026-08-27T23:01:43-05:00",
          "tree_id": "2e4fd4bad0d2b0c27bc9c964a2dde72c9dbe5082",
          "url": "https://github.com/jonattanva/luna-form/commit/ca352b013e8c17115e0139026780e8e5f7cd7da4"
        },
        "date": 1787889734049,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002456715,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007231868599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0245053295,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00028017080000000076,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00039418818000000103,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.019551461100000007,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5adcdf6e86bd7dc85f378a275623ee2feffe745f",
          "message": "Merge pull request #67 from jonattanva/fix/mount-change-event-replay\n\nfix(input): run a mount change event once the form is whole, not while it mounts",
          "timestamp": "2026-08-27T23:10:30-05:00",
          "tree_id": "b6cf38d5d50d78d83f1e018f72a1233c7e46cb5c",
          "url": "https://github.com/jonattanva/luna-form/commit/5adcdf6e86bd7dc85f378a275623ee2feffe745f"
        },
        "date": 1787890292108,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003509921400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010985035,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.035586327300000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004281518200000028,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006099749199999951,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030987613419999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddfd39bee89554e8a2fb274a922199123b16373f",
          "message": "Merge pull request #69 from jonattanva/docs/form-contract-and-style-fixes\n\ndocs: document the form contract around the fields, and fix two config keys it exposed",
          "timestamp": "2026-08-30T00:39:52-05:00",
          "tree_id": "d2d6e26e04acaef29dadd3493ccd591dcfa760bf",
          "url": "https://github.com/jonattanva/luna-form/commit/ddfd39bee89554e8a2fb274a922199123b16373f"
        },
        "date": 1788068447785,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003739626400000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010909554400000009,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03528727296,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004055373799999961,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005802134599999954,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.030266176080000005,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "40e58d9a0389feab7fd84094390c933064b5cca1",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-30T22:41:12-05:00",
          "tree_id": "4daef4062bfa1d34cb627e6afb7ff1976ee17df0",
          "url": "https://github.com/jonattanva/luna-form/commit/40e58d9a0389feab7fd84094390c933064b5cca1"
        },
        "date": 1788147724197,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035858949999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011197951599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03571413865999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004042142599999988,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005692236200000025,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03041176176,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "5ce408c867ec412485c2f5c4f883b13be11b7fef",
          "message": "upgrade dependencie",
          "timestamp": "2026-08-30T22:41:46-05:00",
          "tree_id": "0b77b027d7ae3c2beeda72d758afd242ba6510ad",
          "url": "https://github.com/jonattanva/luna-form/commit/5ce408c867ec412485c2f5c4f883b13be11b7fef"
        },
        "date": 1788147758951,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037663760000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011150221599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03248503824000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042432818000000223,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006038892200000009,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.029356570279999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "bb094e4bf656d405a251c483e16155de5050109c",
          "message": "chore(deps): upgrade dependencies\n\nTwo of these are worth calling out.\n\n`vitest` goes from 4.1.11 to 5.0.0, a major, and the 700 unit tests pass on it\nunchanged.\n\n`@playwright/test` goes from 1.62.1 to 1.63.0, which pins new browser\nrevisions -- chromium 1243, firefox 1543, webkit 2359. A checkout that skips\n`pnpm exec playwright install` fails every e2e at launch with `Executable\ndoesn't exist`, which reads like a broken suite rather than a missing\ndownload.\n\nThe rest are patch or minor: next and eslint-config-next to 16.3.4,\n@base-ui/react to 1.8.0, typescript-eslint to 8.69.0, plus knip, lint-staged,\nglobals and the @types packages.\n\nVerified on the upgraded tree: 700 unit, 1566 e2e across chromium, firefox and\nwebkit, typescript, eslint and prettier.",
          "timestamp": "2026-09-07T09:29:26-05:00",
          "tree_id": "c43b252743b149165227f27b6c43ab109ac4f185",
          "url": "https://github.com/jonattanva/luna-form/commit/bb094e4bf656d405a251c483e16155de5050109c"
        },
        "date": 1788791433331,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027945694,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008837179600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.025061821260000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00032852015999999823,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00046746487999999774,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.021994824519999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a82b6a075e670a4269fd610555cad377d7c2be15",
          "message": "Merge pull request #70 from jonattanva/fix/state-hidden-clear-containers\n\nfix(state): clear a container the same way whichever rule hides it, and let a field opt out",
          "timestamp": "2026-09-07T10:34:33-05:00",
          "tree_id": "d020ea5195f7d6c4cd9c735909877e41538fd3dd",
          "url": "https://github.com/jonattanva/luna-form/commit/a82b6a075e670a4269fd610555cad377d7c2be15"
        },
        "date": 1788795333813,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034747702000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011093032799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03650954326,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004336084399999982,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005957451000000038,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03114692868,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "61612320fe3229f627320a94882d4c16d1214d38",
          "message": "Merge pull request #80 from jonattanva/dependabot/npm_and_yarn/examples/with-next-vanilla/next-16.3.3\n\nchore(deps): bump next from 16.2.12 to 16.3.3 in /examples/with-next-vanilla",
          "timestamp": "2026-09-11T15:39:52-05:00",
          "tree_id": "76af1bf25c2fb0d35d32e8704cd5e8c40d04d47c",
          "url": "https://github.com/jonattanva/luna-form/commit/61612320fe3229f627320a94882d4c16d1214d38"
        },
        "date": 1789159243540,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036936486000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011756533399999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03588463542,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004037367600000016,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005955525200000011,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03147675052,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b2d522f8d428a498514a0108ee9c520067ff3def",
          "message": "Merge pull request #78 from jonattanva/fix/example-remove-accent\n\nfix(example): ask for the accent transform by its name",
          "timestamp": "2026-09-11T15:41:05-05:00",
          "tree_id": "26290689c6ec4fc932374fd85fd17fc1dd0f2219",
          "url": "https://github.com/jonattanva/luna-form/commit/b2d522f8d428a498514a0108ee9c520067ff3def"
        },
        "date": 1789159320963,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034952216000000023,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011689011,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03239357064,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041603127999999745,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005751035799999954,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028624824179999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "69b2eadbbcdb018d2890b7563210ec74f6b4f708",
          "message": "Merge pull request #77 from jonattanva/chore/render-instrument\n\nchore(benchmark): keep the instrument that measured the render work",
          "timestamp": "2026-09-11T15:41:39-05:00",
          "tree_id": "8c3ce980edac440f9105f86ef43f6135eb7034ac",
          "url": "https://github.com/jonattanva/luna-form/commit/69b2eadbbcdb018d2890b7563210ec74f6b4f708"
        },
        "date": 1789159354767,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003667187200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010921609,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.035767726900000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040606957999999395,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006023025400000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03125978819999999,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d57fe7eab473232acfe031354fa66eabfa771b19",
          "message": "Merge pull request #72 from jonattanva/fix/event-spec-flake\n\ntest(event): make the source and dismissal waits deterministic",
          "timestamp": "2026-09-12T09:54:48-05:00",
          "tree_id": "dd1e6bde5f91e182a91256cfffa89384f1fbb9e8",
          "url": "https://github.com/jonattanva/luna-form/commit/d57fe7eab473232acfe031354fa66eabfa771b19"
        },
        "date": 1789224920098,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036146424000000027,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011030665,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03845065692,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004339886800000022,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006074675800000022,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03364547012,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f1b8163db278d86c43844f02baaa85b8d50202e3",
          "message": "Merge pull request #73 from jonattanva/refactor/keep-value-advanced\n\nrefactor(field): keepValue into advanced, plus input-core cleanups and the schema-per-render fix",
          "timestamp": "2026-09-12T09:55:16-05:00",
          "tree_id": "8f0758d28353b92dd4ab437abd27ca88c825cea0",
          "url": "https://github.com/jonattanva/luna-form/commit/f1b8163db278d86c43844f02baaa85b8d50202e3"
        },
        "date": 1789224982850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003665191600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011034950599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.035784026479999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003975623799999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005817034000000058,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03150880204,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "72453b618e114132b8c80d1b81e994de9990b8a9",
          "message": "Merge pull request #75 from jonattanva/perf/atom-family-release\n\nperf: land #74, #75 and #76 -- a field renders when its own value moves",
          "timestamp": "2026-09-12T13:46:59-05:00",
          "tree_id": "2df1d802b291909228a9d54168df176c6789f5b3",
          "url": "https://github.com/jonattanva/luna-form/commit/72453b618e114132b8c80d1b81e994de9990b8a9"
        },
        "date": 1789238867189,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003542055599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00111645352,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03264144902,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041426744000000324,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005950522600000022,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02879547132,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "14a90c28d2f7df96411187c845809c8121da5296",
          "message": "Merge pull request #79 from jonattanva/fix/chained-state-reveal\n\nfix(state): take back what a hidden field's own rules revealed",
          "timestamp": "2026-09-13T00:09:39-05:00",
          "tree_id": "e4196a07881f5ea6a47e87f583c0aee78a73cd36",
          "url": "https://github.com/jonattanva/luna-form/commit/14a90c28d2f7df96411187c845809c8121da5296"
        },
        "date": 1789276227381,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003553446600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00111306358,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0333107931,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004178133600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005887031200000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0281846483,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d375271f777908cf4d3cd3c170f4d9a576a2b8b0",
          "message": "Merge pull request #81 from jonattanva/test/render-budgets\n\ntest(render): count what a keystroke costs, in CI",
          "timestamp": "2026-09-13T14:45:20-05:00",
          "tree_id": "de582c0b91def5544523df38d8cdcbafc83bb18b",
          "url": "https://github.com/jonattanva/luna-form/commit/d375271f777908cf4d3cd3c170f4d9a576a2b8b0"
        },
        "date": 1789328776707,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00039086186,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010922243200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03561627834,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004225472400000035,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005972604599999977,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.031124923560000007,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "403a24d7f29daf2862e8e7d9459363248dbc24ee",
          "message": "Merge pull request #82 from jonattanva/fix/failed-submit-host-value\n\nfix(submit): leave the form as it was after a failed submit",
          "timestamp": "2026-09-14T22:22:21-05:00",
          "tree_id": "a624569c1d798e6dbc5b236fafc59f1af8b3af2f",
          "url": "https://github.com/jonattanva/luna-form/commit/403a24d7f29daf2862e8e7d9459363248dbc24ee"
        },
        "date": 1789442590548,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00034906263999999964,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010828923200000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0355745767,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004192631799999981,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005923421800000051,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03081575516,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "76afb726a82f76bf24ffacbfeefc6ec220ad4a72",
          "message": "Merge pull request #83 from jonattanva/fix/list-remove-nonlast-typed\n\nfix(list): tell the host every name a removed row shifts",
          "timestamp": "2026-09-14T22:29:12-05:00",
          "tree_id": "6aeb2c483d5af93883189be992798c7cab438d5e",
          "url": "https://github.com/jonattanva/luna-form/commit/76afb726a82f76bf24ffacbfeefc6ec220ad4a72"
        },
        "date": 1789443010274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003498146399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00110483362,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.036079834899999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004040215399999943,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006008582200000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.03163892718,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8102e3994317da2013f43d5db719f11921fa7372",
          "message": "Merge pull request #84 from jonattanva/fix/list-assign-stale-rows\n\nfix(list): report every position an assignment rewrites",
          "timestamp": "2026-09-15T07:38:50-05:00",
          "tree_id": "a5efa7f58a08dfa319035e4886c6898132ffd0a6",
          "url": "https://github.com/jonattanva/luna-form/commit/8102e3994317da2013f43d5db719f11921fa7372"
        },
        "date": 1789475987142,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00019608329999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006623969,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.01943301578,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00024298205999999937,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000339210680000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.018267066159999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4128172fcd6e426f199f47f2087cb7990321047",
          "message": "Merge pull request #85 from jonattanva/fix/collapsed-submit\n\nfix(collapsible): hide what is collapsed without taking it out of the form",
          "timestamp": "2026-09-15T15:53:09-05:00",
          "tree_id": "43dc1f2cdb241ec44f5aa26fc57a41588b201e09",
          "url": "https://github.com/jonattanva/luna-form/commit/a4128172fcd6e426f199f47f2087cb7990321047"
        },
        "date": 1789505635300,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020858754000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006459395999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.01949291384,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022613011999999798,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003233047600000009,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.018325943459999994,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0552776035aa3c31559229113b3595fbcfe0861c",
          "message": "Merge pull request #86 from jonattanva/fix/readonly-submit\n\nfix(submit): submit a read-only field, and let an optional one go unsent",
          "timestamp": "2026-09-15T22:55:34-05:00",
          "tree_id": "cbd6c4815d1dd24fe2a18dd3d4f8c5ef7b0a7d27",
          "url": "https://github.com/jonattanva/luna-form/commit/0552776035aa3c31559229113b3595fbcfe0861c"
        },
        "date": 1789530986172,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002528714399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007065819999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02343870182,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002709966799999984,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003809472199999982,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.018781505979999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "eb2aca7b0a66e6aaf0561b1d71d2e416f7f213c4",
          "message": "Merge pull request #87 from jonattanva/fix/unflatten-prototype\n\nfix(extract): a dotted name addresses own properties, not the prototype",
          "timestamp": "2026-09-16T08:48:47-05:00",
          "tree_id": "dea5aa1a5dc9aa1a181de52b55509b33f2f51dd2",
          "url": "https://github.com/jonattanva/luna-form/commit/eb2aca7b0a66e6aaf0561b1d71d2e416f7f213c4"
        },
        "date": 1789566584434,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035895126000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011151055200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03227559042,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000420006199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005851591000000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.026998313779999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7299bd99e1f6494371901546bb050b68a69a83a6",
          "message": "Merge pull request #88 from jonattanva/fix/number-values\n\nfix(schema): a number is absent until given, required means present, and a step says what it accepts",
          "timestamp": "2026-09-16T18:21:24-05:00",
          "tree_id": "e48b403a4a08501a03fdc8b1261c0b52865a159f",
          "url": "https://github.com/jonattanva/luna-form/commit/7299bd99e1f6494371901546bb050b68a69a83a6"
        },
        "date": 1789600947061,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036846000000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.001133517,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03673341182,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042276874000000134,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005686651400000028,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.029724183780000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c3c532b114f95b781e98328d8b277cd2bb09c160",
          "message": "Merge pull request #89 from jonattanva/fix/invalid-pattern\n\nfix(schema): a pattern that does not compile holds the value back instead of taking the form down",
          "timestamp": "2026-09-16T23:05:36-05:00",
          "tree_id": "0106eb3bd106a1d382733b62fd9233854022b8d7",
          "url": "https://github.com/jonattanva/luna-form/commit/c3c532b114f95b781e98328d8b277cd2bb09c160"
        },
        "date": 1789617979537,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002505069400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007411286200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.025131507679999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00027265335999999935,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000386143119999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0185895916,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b4689422a65edde22b5f5b7bdebf954d5e120f8b",
          "message": "Merge pull request #90 from jonattanva/fix/definition-swap\n\nfix(schema): a field registers again when its definition changes, in a registry keyed by name",
          "timestamp": "2026-09-17T10:18:57-05:00",
          "tree_id": "cb1fabfad595543faf1ee04dfcaa6b5dde2606c9",
          "url": "https://github.com/jonattanva/luna-form/commit/b4689422a65edde22b5f5b7bdebf954d5e120f8b"
        },
        "date": 1789658397989,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003727166,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010960069599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03589407208,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004467993000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006314896200000021,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.029043605880000004,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "de56beef76cf395c5f5b7ae775da76e172656722",
          "message": "Merge pull request #91 from jonattanva/docs/pattern-authored\n\ndocs(validation): a pattern runs as written, so its author keeps it from backtracking",
          "timestamp": "2026-09-17T11:44:28-05:00",
          "tree_id": "e1340d5d4419799388a4f02714bdfd961bfbfa65",
          "url": "https://github.com/jonattanva/luna-form/commit/de56beef76cf395c5f5b7ae775da76e172656722"
        },
        "date": 1789663521164,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003411393000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011145144199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03540385212,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043853922000000237,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005877709200000027,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02884430362,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "864d8e31d05513e468d57c2016f574e6248618a8",
          "message": "upgrade dependencies",
          "timestamp": "2026-09-17T12:24:25-05:00",
          "tree_id": "e90222894e2edccda40127ccf3b442b70ece0fb0",
          "url": "https://github.com/jonattanva/luna-form/commit/864d8e31d05513e468d57c2016f574e6248618a8"
        },
        "date": 1789665911465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003500960600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0012439444200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03610374074,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004024412399999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.000588731659999994,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.028998732920000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3ee85780597d647f78540839510c56becd6c122f",
          "message": "Merge pull request #92 from jonattanva/fix/refs-in-render\n\nfix(render): a ref is written when the render commits, not while it renders",
          "timestamp": "2026-09-17T20:28:16-05:00",
          "tree_id": "20119bda275b6844a86887a438147ef65d3927f6",
          "url": "https://github.com/jonattanva/luna-form/commit/3ee85780597d647f78540839510c56becd6c122f"
        },
        "date": 1789694946291,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003576661000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011165145599999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03547647498,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043347193999999944,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006206549200000063,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02952982612000001,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "4bf0ae0e4217174591932d8f4da700856bc7911c",
          "message": "upgrade dependencies",
          "timestamp": "2026-09-18T08:45:04-05:00",
          "tree_id": "59d2cd8f35556be5b5854ace36750826966ae890",
          "url": "https://github.com/jonattanva/luna-form/commit/4bf0ae0e4217174591932d8f4da700856bc7911c"
        },
        "date": 1789739150493,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00037668222000000013,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011346310999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03573995906,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00046143043999999464,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006738470799999959,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.029121636779999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d300fd6052fe447ebfa76fa75fda1439760e3db6",
          "message": "Merge pull request #93 from jonattanva/perf/row-subscription\n\nperf(list): a row reads the form's values only when it has a condition",
          "timestamp": "2026-09-19T16:48:56-05:00",
          "tree_id": "c0a62790fe1dd46a45404de458bf5c458794d222",
          "url": "https://github.com/jonattanva/luna-form/commit/d300fd6052fe447ebfa76fa75fda1439760e3db6"
        },
        "date": 1789854592085,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003474120199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011017677800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.03613274006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040365702000000054,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005858313799999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.029353883780000006,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cb54a0c3316bf00e813662fcb9f107d6994f0c31",
          "message": "Merge pull request #94 from jonattanva/perf/visibility-guard\n\nperf(guard): a state change renders only the guard whose answer changed",
          "timestamp": "2026-09-19T21:24:37-05:00",
          "tree_id": "6d541840f147db826404a170b4d7f2fb5d4a3a32",
          "url": "https://github.com/jonattanva/luna-form/commit/cb54a0c3316bf00e813662fcb9f107d6994f0c31"
        },
        "date": 1789871125556,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003771826600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00084912438,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02820392904,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00032008452000000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004461123799999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.022453811759999994,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7373970b8b23089185302fbfdcc8bdc417a59a6e",
          "message": "Merge pull request #95 from jonattanva/perf/field-errors\n\nperf(field): a field is handed its errors, not a record built around them",
          "timestamp": "2026-09-19T22:46:48-05:00",
          "tree_id": "8fa62778f4e776b7f0e8d6cb2ed6cae53bc902f5",
          "url": "https://github.com/jonattanva/luna-form/commit/7373970b8b23089185302fbfdcc8bdc417a59a6e"
        },
        "date": 1789876051839,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027658299999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008710715399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.02596929446,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003193348999999989,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004671614600000021,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.020822665360000006,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "725eba1c0c4dd788f6dfd4a1a9203b8a5955c7e0",
          "message": "Merge pull request #100 from jonattanva/fix/slot-key-identity\n\nfix(slot): a slot is keyed by what it is, not by where it sits",
          "timestamp": "2026-09-20T01:02:06-05:00",
          "tree_id": "a1994a73e0b0fb8f247d93c58ad07f6b33615a82",
          "url": "https://github.com/jonattanva/luna-form/commit/725eba1c0c4dd788f6dfd4a1a9203b8a5955c7e0"
        },
        "date": 1789884174627,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00030362539999999967,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008766360599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.026128215799999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00033414883999999804,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004964929799999982,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02110109836,
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
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
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
        "date": 1779319337274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 290,
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
          "id": "572c11783ea0d4239321d83fb1e7ea7fbc9bf06d",
          "message": "docs: update and expand field documentation including select, specialized selectors and markdown support",
          "timestamp": "2026-05-20T19:52:53-05:00",
          "tree_id": "7f4325a787a7f282f855c70f7149c3204e2e4f61",
          "url": "https://github.com/jonattanva/luna-form/commit/572c11783ea0d4239321d83fb1e7ea7fbc9bf06d"
        },
        "date": 1779324858432,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 351,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 135,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ab99b00c45af2cc8a3bc2f5a9d17769d7fd82448",
          "message": "fix(react): apply defaultValue silently to avoid skipping first user change and update CI workflow concurrency",
          "timestamp": "2026-05-22T09:38:52-05:00",
          "tree_id": "a3da0df5c8b23cf106f910b61ea3253c6e437041",
          "url": "https://github.com/jonattanva/luna-form/commit/ab99b00c45af2cc8a3bc2f5a9d17769d7fd82448"
        },
        "date": 1779460831759,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 278,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 635,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c65ce54f0c91792090d6bfb500e6adc4a4d18169",
          "message": "fix(react): apply defaultValue silently in onCurrentValueChange fallback\n\nWhen the form receives a value prop that does not include this specific\nfield but the field has a defaultValue, the fallback inside\nonCurrentValueChange armed the skip flag on mount, causing the first\nuser interaction to be silently dropped on select/active and other\nSelectable-strategy fields (chips, etc.).\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>",
          "timestamp": "2026-05-22T16:13:03-05:00",
          "tree_id": "f6ffa5505fba750e7b1a1b8fda1c9a01a1271e75",
          "url": "https://github.com/jonattanva/luna-form/commit/c65ce54f0c91792090d6bfb500e6adc4a4d18169"
        },
        "date": 1779484472071,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 254,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 554,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "7e7eb979f883e1605f52d62d5ccbad0241389c20",
          "message": "fix chips double selection",
          "timestamp": "2026-05-28T20:27:59-05:00",
          "tree_id": "517acedc083304dce4ec4b7cd906be65f9d5d418",
          "url": "https://github.com/jonattanva/luna-form/commit/7e7eb979f883e1605f52d62d5ccbad0241389c20"
        },
        "date": 1780018167301,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 267,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 630,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "359664cea9aa041027f4d51d311871ba5ea0d676",
          "message": "Merge pull request #38 from jonattanva/fix/list-remove-nonlast-hydrated-item\n\nfix(react): list keeps trailing item value on non-last removal",
          "timestamp": "2026-06-01T10:14:40-05:00",
          "tree_id": "e67ae60ef45b50658413cf304de0c61881bf1eab",
          "url": "https://github.com/jonattanva/luna-form/commit/359664cea9aa041027f4d51d311871ba5ea0d676"
        },
        "date": 1780326963150,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 283,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 683,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "15c576f2034e315ab525d5f5bde89a9d59e28dac",
          "message": "Merge pull request #39 from jonattanva/fix/grid-alignment-truncation\n\nfeat(luna-react): improve grid alignment with label truncation",
          "timestamp": "2026-06-01T18:18:04-05:00",
          "tree_id": "46326772d693068ff326708d65282d33fed8927b",
          "url": "https://github.com/jonattanva/luna-form/commit/15c576f2034e315ab525d5f5bde89a9d59e28dac"
        },
        "date": 1780355949585,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 267,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 569,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c976f9b6bf44b412e847a67fb83d056f36a83a8f",
          "message": "fix list",
          "timestamp": "2026-06-01T20:30:52-05:00",
          "tree_id": "4bbf12e245066f8d3a476a0796b7de9fb7557048",
          "url": "https://github.com/jonattanva/luna-form/commit/c976f9b6bf44b412e847a67fb83d056f36a83a8f"
        },
        "date": 1780363925641,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 285,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 601,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "1eb19d48002de67568788b80e995dd3377376497",
          "message": "upgrade dependencies",
          "timestamp": "2026-06-01T22:11:02-05:00",
          "tree_id": "eafe10d1700c03edbd39cc38a6b06250460fa53e",
          "url": "https://github.com/jonattanva/luna-form/commit/1eb19d48002de67568788b80e995dd3377376497"
        },
        "date": 1780369951734,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 176,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "669ee12ec8312f5b5e84c6f68c164792a16104e2",
          "message": "fix list",
          "timestamp": "2026-06-02T10:26:36-05:00",
          "tree_id": "4840088e85c23a929ca3a6615d8ed8ba95746f8e",
          "url": "https://github.com/jonattanva/luna-form/commit/669ee12ec8312f5b5e84c6f68c164792a16104e2"
        },
        "date": 1780414093160,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 270,
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
          "id": "cba7adea2b0e6ee9ac514d0063e92a3a49495f67",
          "message": "fix list",
          "timestamp": "2026-06-02T10:27:06-05:00",
          "tree_id": "d4b5b41d1be4c2780c3b0455889f7cc7e2397026",
          "url": "https://github.com/jonattanva/luna-form/commit/cba7adea2b0e6ee9ac514d0063e92a3a49495f67"
        },
        "date": 1780414128775,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 299,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 670,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b02f4d7eae7c93a60a80fb51102a85572df7fb7b",
          "message": "fix list",
          "timestamp": "2026-06-02T10:39:26-05:00",
          "tree_id": "299233cb829dd129ac9f5217b6e0c32ff5bec51b",
          "url": "https://github.com/jonattanva/luna-form/commit/b02f4d7eae7c93a60a80fb51102a85572df7fb7b"
        },
        "date": 1780414845966,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 289,
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
          "id": "783588b5675ac1cdf22a4b81d8374d47a182fa16",
          "message": "fix error with value",
          "timestamp": "2026-06-10T08:58:35-05:00",
          "tree_id": "90204582a305338a8d95fd2ad329b111b0037f28",
          "url": "https://github.com/jonattanva/luna-form/commit/783588b5675ac1cdf22a4b81d8374d47a182fa16"
        },
        "date": 1781100004310,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 269,
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
          "id": "5b1b0958ea24b15b17f740fc5147464975e53249",
          "message": "fix error with value",
          "timestamp": "2026-06-10T09:07:39-05:00",
          "tree_id": "04f99b5f68f36a8e62abf4621785ea00c7132b8a",
          "url": "https://github.com/jonattanva/luna-form/commit/5b1b0958ea24b15b17f740fc5147464975e53249"
        },
        "date": 1781100531383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 314,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 683,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "d0169698b8af89d6564bc57f1e7a040a59e71ea3",
          "message": "new property in input type list",
          "timestamp": "2026-06-18T10:20:44-05:00",
          "tree_id": "b60f23975866fb72a7a13339954e71326fa4697a",
          "url": "https://github.com/jonattanva/luna-form/commit/d0169698b8af89d6564bc57f1e7a040a59e71ea3"
        },
        "date": 1781796134242,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 264,
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
          "id": "8c90a743ac6d13246309b9d0a84a0f377998b85d",
          "message": "fix tests",
          "timestamp": "2026-06-18T10:46:16-05:00",
          "tree_id": "31df68e86371030191f23b6511c00b3f74cd98c3",
          "url": "https://github.com/jonattanva/luna-form/commit/8c90a743ac6d13246309b9d0a84a0f377998b85d"
        },
        "date": 1781797905386,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 264,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 204,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "dfcc19b3ab9e808888a0a8ed52c2290bf7180d88",
          "message": "fix list",
          "timestamp": "2026-06-20T13:22:26-05:00",
          "tree_id": "dee85955c6788e2cc475fe4aa079b7e6cb639bda",
          "url": "https://github.com/jonattanva/luna-form/commit/dfcc19b3ab9e808888a0a8ed52c2290bf7180d88"
        },
        "date": 1781979835914,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 239,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 179,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "67028e4d33317c662e66f20e707f37e8662c1441",
          "message": "fix list",
          "timestamp": "2026-06-20T13:25:20-05:00",
          "tree_id": "0b32b138143ff645f718d0501eab5db9d2f66ad1",
          "url": "https://github.com/jonattanva/luna-form/commit/67028e4d33317c662e66f20e707f37e8662c1441"
        },
        "date": 1781979999072,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 266,
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
          "id": "0ef0640780905fa7e31eb621ccbf0f15ce61acd2",
          "message": "fix error select",
          "timestamp": "2026-07-02T22:43:04-05:00",
          "tree_id": "112d98d2f2b51df8984bb821d08d8ad9317cbec6",
          "url": "https://github.com/jonattanva/luna-form/commit/0ef0640780905fa7e31eb621ccbf0f15ce61acd2"
        },
        "date": 1783050277292,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 270,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 611,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bc510fb2f31ea7b72999417f7fc690daf858aa26",
          "message": "Merge pull request #40 from jonattanva/feat/headless-form-schema\n\nHeadless form schema + declarative validation vocabulary",
          "timestamp": "2026-07-10T14:43:14-05:00",
          "tree_id": "e7887a7e5da5d7210be0d7cd19a9ff819aca017a",
          "url": "https://github.com/jonattanva/luna-form/commit/bc510fb2f31ea7b72999417f7fc690daf858aa26"
        },
        "date": 1783712683582,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 315,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 684,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "62047155a3fc520f0b0f536e920a0635bc46f4e2",
          "message": "Merge pull request #41 from jonattanva/feat/nested-hidden-expression-schema\n\nfeat(schema): nested dotted names, @-expression patterns, hidden-awareness (0.0.70)",
          "timestamp": "2026-07-10T22:33:38-05:00",
          "tree_id": "31389d9d2cf03f035d2a753e6e7f734d64ddd607",
          "url": "https://github.com/jonattanva/luna-form/commit/62047155a3fc520f0b0f536e920a0635bc46f4e2"
        },
        "date": 1783740901452,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
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
          "id": "4008e2ac1c5ccf6adc0b17928328a55f72f4517e",
          "message": "fix tests",
          "timestamp": "2026-07-11T11:41:00-05:00",
          "tree_id": "7f3df7eaae87727a2f3f569f5600f1eaef8053c2",
          "url": "https://github.com/jonattanva/luna-form/commit/4008e2ac1c5ccf6adc0b17928328a55f72f4517e"
        },
        "date": 1783788140898,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 214,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 427,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "fd2c2be44af1419b04a71848b51ed9795a8f972e",
          "message": "fix tests",
          "timestamp": "2026-07-11T12:33:04-05:00",
          "tree_id": "c64473d8cac86ea364789cb74f64f3a8343e00e3",
          "url": "https://github.com/jonattanva/luna-form/commit/fd2c2be44af1419b04a71848b51ed9795a8f972e"
        },
        "date": 1783791276653,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 207,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 136,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fe2c6e2573d533aa0f0006d42883125c0af290cf",
          "message": "Merge pull request #43 from jonattanva/feat/empty-operator-self-contained-types\n\nfeat: `empty` operator + self-contained schema types (0.0.72)",
          "timestamp": "2026-07-11T13:18:03-05:00",
          "tree_id": "99c5d2c03b021a5c0c9134d6a8582d260e40f0f2",
          "url": "https://github.com/jonattanva/luna-form/commit/fe2c6e2573d533aa0f0006d42883125c0af290cf"
        },
        "date": 1783793961736,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 246,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 469,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "16d243217cba51e85af73dab72b6f7aff4500437",
          "message": "Merge pull request #42 from jonattanva/fix/self-contained-schema-types\n\nfix(types): self-contained declarations (react-luna-form/schema no longer resolves to any) (0.0.71)",
          "timestamp": "2026-07-11T13:23:02-05:00",
          "tree_id": "99c5d2c03b021a5c0c9134d6a8582d260e40f0f2",
          "url": "https://github.com/jonattanva/luna-form/commit/16d243217cba51e85af73dab72b6f7aff4500437"
        },
        "date": 1783794247730,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 307,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 245,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29adaf5015234011ac7425e6ea6a226bad478686",
          "message": "Merge pull request #44 from jonattanva/fix/fields-union-types-0.0.73\n\nfix types",
          "timestamp": "2026-07-11T14:25:24-05:00",
          "tree_id": "37d64600fe232c294f01d07127c84d38e2c8a285",
          "url": "https://github.com/jonattanva/luna-form/commit/29adaf5015234011ac7425e6ea6a226bad478686"
        },
        "date": 1783797997324,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 252,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 197,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "5510462c18c1ae29d734a3146198864e29ee3f48",
          "message": "upgrade dependencies",
          "timestamp": "2026-07-11T14:40:33-05:00",
          "tree_id": "c6e38c4d59ad1cd192c3f23bdebf4ba43f19f21d",
          "url": "https://github.com/jonattanva/luna-form/commit/5510462c18c1ae29d734a3146198864e29ee3f48"
        },
        "date": 1783798922771,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 287,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 158,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f89ed82299b7ae98093b3993ae53825d87949950",
          "message": "Merge pull request #49 from jonattanva/feat/translate-array-source-options\n\nfeat(source): translate option labels for array sources",
          "timestamp": "2026-08-01T23:29:39-05:00",
          "tree_id": "ba8335a5bf470f0b1f91f4d5e95b7dc0d4340105",
          "url": "https://github.com/jonattanva/luna-form/commit/f89ed82299b7ae98093b3993ae53825d87949950"
        },
        "date": 1785645066862,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 277,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 635,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3e61236a026f65e070993d036e1b080ee1e4a394",
          "message": "Merge pull request #50 from jonattanva/feat/locale-aware-specialized-selectors\n\nfeat(selectors): resolve built-in option labels through the form language",
          "timestamp": "2026-08-01T23:38:02-05:00",
          "tree_id": "e993338469b81cbb0e377d464895a7947602cfe8",
          "url": "https://github.com/jonattanva/luna-form/commit/3e61236a026f65e070993d036e1b080ee1e4a394"
        },
        "date": 1785645563961,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 214,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "987649b543ee1ac1ba34b881c2e256bd260adeea",
          "message": "Merge pull request #45 from jonattanva/fix/section-translation\n\nFix/section translation",
          "timestamp": "2026-08-01T23:38:04-05:00",
          "tree_id": "dbceddff403963f0c45874ed32bd2ac47ddb5e33",
          "url": "https://github.com/jonattanva/luna-form/commit/987649b543ee1ac1ba34b881c2e256bd260adeea"
        },
        "date": 1785645565715,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 286,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2525ad2c64f500d6482f8e62fe2ba3575ff515da",
          "message": "Merge pull request #51 from jonattanva/fix/benchmark-gh-pages-fetch\n\nfix(ci): stop the browser benchmark from refetching gh-pages",
          "timestamp": "2026-08-02T00:20:12-05:00",
          "tree_id": "09f3843251bb8479cc8e8009991c6dbfe177db72",
          "url": "https://github.com/jonattanva/luna-form/commit/2525ad2c64f500d6482f8e62fe2ba3575ff515da"
        },
        "date": 1785648096279,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 208,
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
          "id": "fa75fba7d5ce464b29f86723dfd028e912c8643a",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-02T00:29:54-05:00",
          "tree_id": "a5df4033a8e96fd91c70e1d1a8dcd109e7721bd9",
          "url": "https://github.com/jonattanva/luna-form/commit/fa75fba7d5ce464b29f86723dfd028e912c8643a"
        },
        "date": 1785648683675,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 279,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 520,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "860fecff25e23b8531b43b4b46156be5ba96f1ee",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-02T01:21:54-05:00",
          "tree_id": "ced36329ee19b6b51e08d31cca3dc3c73e6c2662",
          "url": "https://github.com/jonattanva/luna-form/commit/860fecff25e23b8531b43b4b46156be5ba96f1ee"
        },
        "date": 1785651815399,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 299,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a8ece23edf88f8cd003335a0ca31f3fc3cf4d600",
          "message": "Merge pull request #52 from jonattanva/feat/built-in-translations\n\nfeat(translations): resolve the library's own copy through the dictionary",
          "timestamp": "2026-08-02T21:11:28-05:00",
          "tree_id": "67ed2cdb8cd22ced323b6d50c8a5edc536e54b44",
          "url": "https://github.com/jonattanva/luna-form/commit/a8ece23edf88f8cd003335a0ca31f3fc3cf4d600"
        },
        "date": 1785723167932,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 277,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 587,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5398374c29c771fb4abe1ced646301ebad628e97",
          "message": "Merge pull request #53 from jonattanva/fix/value-event-focused-target\n\nfix(events): postpone an auto-fill into the field that has focus",
          "timestamp": "2026-08-03T09:30:48-05:00",
          "tree_id": "8707cff397ae8d01cbbc586d54e8fa178fbe3118",
          "url": "https://github.com/jonattanva/luna-form/commit/5398374c29c771fb4abe1ced646301ebad628e97"
        },
        "date": 1785767540782,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
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
          "id": "ef84050759f7c40de86ca479445e0debef662a67",
          "message": "upgrade version",
          "timestamp": "2026-08-03T09:45:28-05:00",
          "tree_id": "f91fd40554bd3f6fd96710e707a401c6049ca2c8",
          "url": "https://github.com/jonattanva/luna-form/commit/ef84050759f7c40de86ca479445e0debef662a67"
        },
        "date": 1785768423445,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 312,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 689,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "061c4b1de9921d72983ea1569e9c006ac5de09a2",
          "message": "Merge pull request #54 from jonattanva/fix/value-event-off-the-transition\n\nfix(events): take the auto-fill write off the transition",
          "timestamp": "2026-08-03T14:37:29-05:00",
          "tree_id": "088a81aae59ffbfbbaf415943b6631fb14d689e6",
          "url": "https://github.com/jonattanva/luna-form/commit/061c4b1de9921d72983ea1569e9c006ac5de09a2"
        },
        "date": 1785785941675,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 658,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b4bc9394c4e3a0e28c90d1c1302220753f4e8f7c",
          "message": "upgrade version",
          "timestamp": "2026-08-03T15:33:40-05:00",
          "tree_id": "ce8c5963b2bc05a005f0046b84cbc426cd1d29af",
          "url": "https://github.com/jonattanva/luna-form/commit/b4bc9394c4e3a0e28c90d1c1302220753f4e8f7c"
        },
        "date": 1785789324249,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 290,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 625,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51189b9dfc99ac440946d246a79d10f11dd17ccd",
          "message": "Merge pull request #55 from jonattanva/fix/empty-value-from-value-prop\n\nfix(value): empty a form from the value prop, and ship the submit summary",
          "timestamp": "2026-08-04T10:27:13-05:00",
          "tree_id": "e7d0d74347eea8ceb5d0de65ca148b00f3512438",
          "url": "https://github.com/jonattanva/luna-form/commit/51189b9dfc99ac440946d246a79d10f11dd17ccd"
        },
        "date": 1785857342503,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "718ea3d96a2b62ec265cd65b12128f05700f0a22",
          "message": "Merge pull request #56 from jonattanva/feat/interpolate-whole-placeholder\n\nfeat(list): let a value change event assign a list",
          "timestamp": "2026-08-12T11:05:07-05:00",
          "tree_id": "a0bf0904b35a672cf3bc78b934b3d54c8ae5240e",
          "url": "https://github.com/jonattanva/luna-form/commit/718ea3d96a2b62ec265cd65b12128f05700f0a22"
        },
        "date": 1786550804665,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 281,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 223,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ada296b5a8467c306d76569dbda5d9b76fd881eb",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-12T11:13:26-05:00",
          "tree_id": "82872d50486a75261baf5abc2a0072cfe078dead",
          "url": "https://github.com/jonattanva/luna-form/commit/ada296b5a8467c306d76569dbda5d9b76fd881eb"
        },
        "date": 1786551280600,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 192,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 117,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0e9dd1cf951c049d47145c42efeb38f23db17c92",
          "message": "Merge pull request #57 from jonattanva/fix/nested-list-outer-clobber\n\nfix(list): read a nested list from the list, not from a snapshot",
          "timestamp": "2026-08-14T08:21:32-05:00",
          "tree_id": "8e36d437ce2686316579d19e85a6a23d00d9521d",
          "url": "https://github.com/jonattanva/luna-form/commit/0e9dd1cf951c049d47145c42efeb38f23db17c92"
        },
        "date": 1786713787465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6f6c04c4af4ba92599be2c483fc63fe02b1a8383",
          "message": "Merge pull request #58 from jonattanva/fix/nested-list-value-assignment\n\nfix(list): assign the lists inside the rows, not just the rows",
          "timestamp": "2026-08-15T14:15:38-05:00",
          "tree_id": "fbbd53bd0947d5b0838e0f15b1d7630d10c65e40",
          "url": "https://github.com/jonattanva/luna-form/commit/6f6c04c4af4ba92599be2c483fc63fe02b1a8383"
        },
        "date": 1786821428107,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 270,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 221,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "e039ec268808042284a395e489baf55f9d57f94e",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-17T12:25:53-05:00",
          "tree_id": "55126e016eb5385103d0119f745add69693c441a",
          "url": "https://github.com/jonattanva/luna-form/commit/e039ec268808042284a395e489baf55f9d57f94e"
        },
        "date": 1786987635819,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 276,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 596,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "044fc116d72a3889e7ce6a58b6581c4ab0c04414",
          "message": "Merge pull request #59 from jonattanva/docs/ship-docs-in-package\n\ndocs: ship the form documentation inside the package",
          "timestamp": "2026-08-24T22:08:40-05:00",
          "tree_id": "de74c26b8069c9eb5e3459a14ecc275d79cde50f",
          "url": "https://github.com/jonattanva/luna-form/commit/044fc116d72a3889e7ce6a58b6581c4ab0c04414"
        },
        "date": 1787627398404,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 281,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 557,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "883efe9b0a3b95397255e6615f9ecd9b98a330e0",
          "message": "Merge pull request #60 from jonattanva/fix/checkbox-default-checked\n\nfix(checkbox): read the default by truthiness, not by presence",
          "timestamp": "2026-08-25T08:29:26-05:00",
          "tree_id": "5445e1bd2da2d1122b3de237b79612dda74ec442",
          "url": "https://github.com/jonattanva/luna-form/commit/883efe9b0a3b95397255e6615f9ecd9b98a330e0"
        },
        "date": 1787664647467,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 226,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 166,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8873761e5e3b8ed7f3ae1eff3c065042bd531bbb",
          "message": "Merge pull request #63 from jonattanva/chore/knip-entry-exports\n\nchore(core): let knip see luna-core, and clear what it found",
          "timestamp": "2026-08-25T09:14:43-05:00",
          "tree_id": "812b172f326a8c852015df79a8244fe62204a315",
          "url": "https://github.com/jonattanva/luna-form/commit/8873761e5e3b8ed7f3ae1eff3c065042bd531bbb"
        },
        "date": 1787667369019,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 221,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 143,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "ef8d8398826b4fa03f75162ff0f12bb5ffea963e",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-25T09:56:44-05:00",
          "tree_id": "cfd938a239435b75e1e10817f6949f94f1a5381d",
          "url": "https://github.com/jonattanva/luna-form/commit/ef8d8398826b4fa03f75162ff0f12bb5ffea963e"
        },
        "date": 1787669889834,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 558,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cb97e89c172e207b4e029637563d5bf9d2cd2181",
          "message": "Merge pull request #64 from jonattanva/fix/chips-mount-change-events\n\nfix(chips): match a `when` against the array, not against its text",
          "timestamp": "2026-08-27T07:36:11-05:00",
          "tree_id": "b6125843c6c03f30c89478634c307e8bbf45ff02",
          "url": "https://github.com/jonattanva/luna-form/commit/cb97e89c172e207b4e029637563d5bf9d2cd2181"
        },
        "date": 1787834266651,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 279,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 191,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "0cfb801099bf2d5d0aed5251220d2c0783497a45",
          "message": "upgrade dependencie",
          "timestamp": "2026-08-27T14:07:47-05:00",
          "tree_id": "5532013d41ce7b3ab1bf8c9747e446237ae5d523",
          "url": "https://github.com/jonattanva/luna-form/commit/0cfb801099bf2d5d0aed5251220d2c0783497a45"
        },
        "date": 1787857765719,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 296,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 652,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "55b221c0be7944122d99922e956d0e0f5ea8092f",
          "message": "Merge pull request #66 from jonattanva/fix/state-hidden-clear-reported\n\nfix(state): report the clear when a state action hides a field",
          "timestamp": "2026-08-27T22:55:10-05:00",
          "tree_id": "1f27e65a8dc14732d1cfeb02f3ecb3e5ca71be2f",
          "url": "https://github.com/jonattanva/luna-form/commit/55b221c0be7944122d99922e956d0e0f5ea8092f"
        },
        "date": 1787889404587,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 630,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca352b013e8c17115e0139026780e8e5f7cd7da4",
          "message": "Merge pull request #68 from jonattanva/chore/bundle-size-comment-non-fatal\n\nci: let a failed bundle-size comment stop failing the build",
          "timestamp": "2026-08-27T23:01:43-05:00",
          "tree_id": "2e4fd4bad0d2b0c27bc9c964a2dde72c9dbe5082",
          "url": "https://github.com/jonattanva/luna-form/commit/ca352b013e8c17115e0139026780e8e5f7cd7da4"
        },
        "date": 1787889769382,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 201,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 283,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5adcdf6e86bd7dc85f378a275623ee2feffe745f",
          "message": "Merge pull request #67 from jonattanva/fix/mount-change-event-replay\n\nfix(input): run a mount change event once the form is whole, not while it mounts",
          "timestamp": "2026-08-27T23:10:30-05:00",
          "tree_id": "b6cf38d5d50d78d83f1e018f72a1233c7e46cb5c",
          "url": "https://github.com/jonattanva/luna-form/commit/5adcdf6e86bd7dc85f378a275623ee2feffe745f"
        },
        "date": 1787890343334,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 638,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddfd39bee89554e8a2fb274a922199123b16373f",
          "message": "Merge pull request #69 from jonattanva/docs/form-contract-and-style-fixes\n\ndocs: document the form contract around the fields, and fix two config keys it exposed",
          "timestamp": "2026-08-30T00:39:52-05:00",
          "tree_id": "d2d6e26e04acaef29dadd3493ccd591dcfa760bf",
          "url": "https://github.com/jonattanva/luna-form/commit/ddfd39bee89554e8a2fb274a922199123b16373f"
        },
        "date": 1788068473784,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 271,
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
          "id": "40e58d9a0389feab7fd84094390c933064b5cca1",
          "message": "upgrade dependencies",
          "timestamp": "2026-08-30T22:41:12-05:00",
          "tree_id": "4daef4062bfa1d34cb627e6afb7ff1976ee17df0",
          "url": "https://github.com/jonattanva/luna-form/commit/40e58d9a0389feab7fd84094390c933064b5cca1"
        },
        "date": 1788147751974,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 288,
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
          "id": "5ce408c867ec412485c2f5c4f883b13be11b7fef",
          "message": "upgrade dependencie",
          "timestamp": "2026-08-30T22:41:46-05:00",
          "tree_id": "0b77b027d7ae3c2beeda72d758afd242ba6510ad",
          "url": "https://github.com/jonattanva/luna-form/commit/5ce408c867ec412485c2f5c4f883b13be11b7fef"
        },
        "date": 1788147786030,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
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
          "id": "bb094e4bf656d405a251c483e16155de5050109c",
          "message": "chore(deps): upgrade dependencies\n\nTwo of these are worth calling out.\n\n`vitest` goes from 4.1.11 to 5.0.0, a major, and the 700 unit tests pass on it\nunchanged.\n\n`@playwright/test` goes from 1.62.1 to 1.63.0, which pins new browser\nrevisions -- chromium 1243, firefox 1543, webkit 2359. A checkout that skips\n`pnpm exec playwright install` fails every e2e at launch with `Executable\ndoesn't exist`, which reads like a broken suite rather than a missing\ndownload.\n\nThe rest are patch or minor: next and eslint-config-next to 16.3.4,\n@base-ui/react to 1.8.0, typescript-eslint to 8.69.0, plus knip, lint-staged,\nglobals and the @types packages.\n\nVerified on the upgraded tree: 700 unit, 1566 e2e across chromium, firefox and\nwebkit, typescript, eslint and prettier.",
          "timestamp": "2026-09-07T09:29:26-05:00",
          "tree_id": "c43b252743b149165227f27b6c43ab109ac4f185",
          "url": "https://github.com/jonattanva/luna-form/commit/bb094e4bf656d405a251c483e16155de5050109c"
        },
        "date": 1788791464822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 222,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 124,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a82b6a075e670a4269fd610555cad377d7c2be15",
          "message": "Merge pull request #70 from jonattanva/fix/state-hidden-clear-containers\n\nfix(state): clear a container the same way whichever rule hides it, and let a field opt out",
          "timestamp": "2026-09-07T10:34:33-05:00",
          "tree_id": "d020ea5195f7d6c4cd9c735909877e41538fd3dd",
          "url": "https://github.com/jonattanva/luna-form/commit/a82b6a075e670a4269fd610555cad377d7c2be15"
        },
        "date": 1788795365163,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 311,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "61612320fe3229f627320a94882d4c16d1214d38",
          "message": "Merge pull request #80 from jonattanva/dependabot/npm_and_yarn/examples/with-next-vanilla/next-16.3.3\n\nchore(deps): bump next from 16.2.12 to 16.3.3 in /examples/with-next-vanilla",
          "timestamp": "2026-09-11T15:39:52-05:00",
          "tree_id": "76af1bf25c2fb0d35d32e8704cd5e8c40d04d47c",
          "url": "https://github.com/jonattanva/luna-form/commit/61612320fe3229f627320a94882d4c16d1214d38"
        },
        "date": 1789159272959,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 313,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 242,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b2d522f8d428a498514a0108ee9c520067ff3def",
          "message": "Merge pull request #78 from jonattanva/fix/example-remove-accent\n\nfix(example): ask for the accent transform by its name",
          "timestamp": "2026-09-11T15:41:05-05:00",
          "tree_id": "26290689c6ec4fc932374fd85fd17fc1dd0f2219",
          "url": "https://github.com/jonattanva/luna-form/commit/b2d522f8d428a498514a0108ee9c520067ff3def"
        },
        "date": 1789159349169,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 275,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 525,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "69b2eadbbcdb018d2890b7563210ec74f6b4f708",
          "message": "Merge pull request #77 from jonattanva/chore/render-instrument\n\nchore(benchmark): keep the instrument that measured the render work",
          "timestamp": "2026-09-11T15:41:39-05:00",
          "tree_id": "8c3ce980edac440f9105f86ef43f6135eb7034ac",
          "url": "https://github.com/jonattanva/luna-form/commit/69b2eadbbcdb018d2890b7563210ec74f6b4f708"
        },
        "date": 1789159384591,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 290,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d57fe7eab473232acfe031354fa66eabfa771b19",
          "message": "Merge pull request #72 from jonattanva/fix/event-spec-flake\n\ntest(event): make the source and dismissal waits deterministic",
          "timestamp": "2026-09-12T09:54:48-05:00",
          "tree_id": "dd1e6bde5f91e182a91256cfffa89384f1fbb9e8",
          "url": "https://github.com/jonattanva/luna-form/commit/d57fe7eab473232acfe031354fa66eabfa771b19"
        },
        "date": 1789224947345,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 257,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 513,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f1b8163db278d86c43844f02baaa85b8d50202e3",
          "message": "Merge pull request #73 from jonattanva/refactor/keep-value-advanced\n\nrefactor(field): keepValue into advanced, plus input-core cleanups and the schema-per-render fix",
          "timestamp": "2026-09-12T09:55:16-05:00",
          "tree_id": "8f0758d28353b92dd4ab437abd27ca88c825cea0",
          "url": "https://github.com/jonattanva/luna-form/commit/f1b8163db278d86c43844f02baaa85b8d50202e3"
        },
        "date": 1789225014593,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 289,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 556,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "72453b618e114132b8c80d1b81e994de9990b8a9",
          "message": "Merge pull request #75 from jonattanva/perf/atom-family-release\n\nperf: land #74, #75 and #76 -- a field renders when its own value moves",
          "timestamp": "2026-09-12T13:46:59-05:00",
          "tree_id": "2df1d802b291909228a9d54168df176c6789f5b3",
          "url": "https://github.com/jonattanva/luna-form/commit/72453b618e114132b8c80d1b81e994de9990b8a9"
        },
        "date": 1789238893346,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 285,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 566,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "14a90c28d2f7df96411187c845809c8121da5296",
          "message": "Merge pull request #79 from jonattanva/fix/chained-state-reveal\n\nfix(state): take back what a hidden field's own rules revealed",
          "timestamp": "2026-09-13T00:09:39-05:00",
          "tree_id": "e4196a07881f5ea6a47e87f583c0aee78a73cd36",
          "url": "https://github.com/jonattanva/luna-form/commit/14a90c28d2f7df96411187c845809c8121da5296"
        },
        "date": 1789276253574,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 272,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 570,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d375271f777908cf4d3cd3c170f4d9a576a2b8b0",
          "message": "Merge pull request #81 from jonattanva/test/render-budgets\n\ntest(render): count what a keystroke costs, in CI",
          "timestamp": "2026-09-13T14:45:20-05:00",
          "tree_id": "de582c0b91def5544523df38d8cdcbafc83bb18b",
          "url": "https://github.com/jonattanva/luna-form/commit/d375271f777908cf4d3cd3c170f4d9a576a2b8b0"
        },
        "date": 1789328808516,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 316,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 632,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "403a24d7f29daf2862e8e7d9459363248dbc24ee",
          "message": "Merge pull request #82 from jonattanva/fix/failed-submit-host-value\n\nfix(submit): leave the form as it was after a failed submit",
          "timestamp": "2026-09-14T22:22:21-05:00",
          "tree_id": "a624569c1d798e6dbc5b236fafc59f1af8b3af2f",
          "url": "https://github.com/jonattanva/luna-form/commit/403a24d7f29daf2862e8e7d9459363248dbc24ee"
        },
        "date": 1789442619053,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 307,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 601,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "76afb726a82f76bf24ffacbfeefc6ec220ad4a72",
          "message": "Merge pull request #83 from jonattanva/fix/list-remove-nonlast-typed\n\nfix(list): tell the host every name a removed row shifts",
          "timestamp": "2026-09-14T22:29:12-05:00",
          "tree_id": "6aeb2c483d5af93883189be992798c7cab438d5e",
          "url": "https://github.com/jonattanva/luna-form/commit/76afb726a82f76bf24ffacbfeefc6ec220ad4a72"
        },
        "date": 1789443040124,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 292,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 222,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8102e3994317da2013f43d5db719f11921fa7372",
          "message": "Merge pull request #84 from jonattanva/fix/list-assign-stale-rows\n\nfix(list): report every position an assignment rewrites",
          "timestamp": "2026-09-15T07:38:50-05:00",
          "tree_id": "a5efa7f58a08dfa319035e4886c6898132ffd0a6",
          "url": "https://github.com/jonattanva/luna-form/commit/8102e3994317da2013f43d5db719f11921fa7372"
        },
        "date": 1789476038945,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 194,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 139,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4128172fcd6e426f199f47f2087cb7990321047",
          "message": "Merge pull request #85 from jonattanva/fix/collapsed-submit\n\nfix(collapsible): hide what is collapsed without taking it out of the form",
          "timestamp": "2026-09-15T15:53:09-05:00",
          "tree_id": "43dc1f2cdb241ec44f5aa26fc57a41588b201e09",
          "url": "https://github.com/jonattanva/luna-form/commit/a4128172fcd6e426f199f47f2087cb7990321047"
        },
        "date": 1789505660908,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 192,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 144,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0552776035aa3c31559229113b3595fbcfe0861c",
          "message": "Merge pull request #86 from jonattanva/fix/readonly-submit\n\nfix(submit): submit a read-only field, and let an optional one go unsent",
          "timestamp": "2026-09-15T22:55:34-05:00",
          "tree_id": "cbd6c4815d1dd24fe2a18dd3d4f8c5ef7b0a7d27",
          "url": "https://github.com/jonattanva/luna-form/commit/0552776035aa3c31559229113b3595fbcfe0861c"
        },
        "date": 1789531014296,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 201,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 142,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "eb2aca7b0a66e6aaf0561b1d71d2e416f7f213c4",
          "message": "Merge pull request #87 from jonattanva/fix/unflatten-prototype\n\nfix(extract): a dotted name addresses own properties, not the prototype",
          "timestamp": "2026-09-16T08:48:47-05:00",
          "tree_id": "dea5aa1a5dc9aa1a181de52b55509b33f2f51dd2",
          "url": "https://github.com/jonattanva/luna-form/commit/eb2aca7b0a66e6aaf0561b1d71d2e416f7f213c4"
        },
        "date": 1789566614000,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 299,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 635,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7299bd99e1f6494371901546bb050b68a69a83a6",
          "message": "Merge pull request #88 from jonattanva/fix/number-values\n\nfix(schema): a number is absent until given, required means present, and a step says what it accepts",
          "timestamp": "2026-09-16T18:21:24-05:00",
          "tree_id": "e48b403a4a08501a03fdc8b1261c0b52865a159f",
          "url": "https://github.com/jonattanva/luna-form/commit/7299bd99e1f6494371901546bb050b68a69a83a6"
        },
        "date": 1789600978535,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 282,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 594,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c3c532b114f95b781e98328d8b277cd2bb09c160",
          "message": "Merge pull request #89 from jonattanva/fix/invalid-pattern\n\nfix(schema): a pattern that does not compile holds the value back instead of taking the form down",
          "timestamp": "2026-09-16T23:05:36-05:00",
          "tree_id": "0106eb3bd106a1d382733b62fd9233854022b8d7",
          "url": "https://github.com/jonattanva/luna-form/commit/c3c532b114f95b781e98328d8b277cd2bb09c160"
        },
        "date": 1789618005792,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 276,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 387,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b4689422a65edde22b5f5b7bdebf954d5e120f8b",
          "message": "Merge pull request #90 from jonattanva/fix/definition-swap\n\nfix(schema): a field registers again when its definition changes, in a registry keyed by name",
          "timestamp": "2026-09-17T10:18:57-05:00",
          "tree_id": "cb1fabfad595543faf1ee04dfcaa6b5dde2606c9",
          "url": "https://github.com/jonattanva/luna-form/commit/b4689422a65edde22b5f5b7bdebf954d5e120f8b"
        },
        "date": 1789658426219,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 305,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "de56beef76cf395c5f5b7ae775da76e172656722",
          "message": "Merge pull request #91 from jonattanva/docs/pattern-authored\n\ndocs(validation): a pattern runs as written, so its author keeps it from backtracking",
          "timestamp": "2026-09-17T11:44:28-05:00",
          "tree_id": "e1340d5d4419799388a4f02714bdfd961bfbfa65",
          "url": "https://github.com/jonattanva/luna-form/commit/de56beef76cf395c5f5b7ae775da76e172656722"
        },
        "date": 1789663550526,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 297,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 204,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "864d8e31d05513e468d57c2016f574e6248618a8",
          "message": "upgrade dependencies",
          "timestamp": "2026-09-17T12:24:25-05:00",
          "tree_id": "e90222894e2edccda40127ccf3b442b70ece0fb0",
          "url": "https://github.com/jonattanva/luna-form/commit/864d8e31d05513e468d57c2016f574e6248618a8"
        },
        "date": 1789665938796,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 292,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 618,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3ee85780597d647f78540839510c56becd6c122f",
          "message": "Merge pull request #92 from jonattanva/fix/refs-in-render\n\nfix(render): a ref is written when the render commits, not while it renders",
          "timestamp": "2026-09-17T20:28:16-05:00",
          "tree_id": "20119bda275b6844a86887a438147ef65d3927f6",
          "url": "https://github.com/jonattanva/luna-form/commit/3ee85780597d647f78540839510c56becd6c122f"
        },
        "date": 1789694973428,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 321,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 643,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "4bf0ae0e4217174591932d8f4da700856bc7911c",
          "message": "upgrade dependencies",
          "timestamp": "2026-09-18T08:45:04-05:00",
          "tree_id": "59d2cd8f35556be5b5854ace36750826966ae890",
          "url": "https://github.com/jonattanva/luna-form/commit/4bf0ae0e4217174591932d8f4da700856bc7911c"
        },
        "date": 1789739175747,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 284,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 154,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d300fd6052fe447ebfa76fa75fda1439760e3db6",
          "message": "Merge pull request #93 from jonattanva/perf/row-subscription\n\nperf(list): a row reads the form's values only when it has a condition",
          "timestamp": "2026-09-19T16:48:56-05:00",
          "tree_id": "c0a62790fe1dd46a45404de458bf5c458794d222",
          "url": "https://github.com/jonattanva/luna-form/commit/d300fd6052fe447ebfa76fa75fda1439760e3db6"
        },
        "date": 1789854620531,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 288,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cb54a0c3316bf00e813662fcb9f107d6994f0c31",
          "message": "Merge pull request #94 from jonattanva/perf/visibility-guard\n\nperf(guard): a state change renders only the guard whose answer changed",
          "timestamp": "2026-09-19T21:24:37-05:00",
          "tree_id": "6d541840f147db826404a170b4d7f2fb5d4a3a32",
          "url": "https://github.com/jonattanva/luna-form/commit/cb54a0c3316bf00e813662fcb9f107d6994f0c31"
        },
        "date": 1789871153794,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 242,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 167,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7373970b8b23089185302fbfdcc8bdc417a59a6e",
          "message": "Merge pull request #95 from jonattanva/perf/field-errors\n\nperf(field): a field is handed its errors, not a record built around them",
          "timestamp": "2026-09-19T22:46:48-05:00",
          "tree_id": "8fa62778f4e776b7f0e8d6cb2ed6cae53bc902f5",
          "url": "https://github.com/jonattanva/luna-form/commit/7373970b8b23089185302fbfdcc8bdc417a59a6e"
        },
        "date": 1789876076815,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 218,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 440,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}