window.BENCHMARK_DATA = {
  "lastUpdate": 1795145628120,
  "repoUrl": "https://github.com/jonattanva/luna-form",
  "entries": {
    "Luna Form core benchmarks": [
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
          "id": "9b772eb80d722e9f86b98cda0cbaa48605798ed2",
          "message": "Merge pull request #110 from jonattanva/fix/field-own-disabled\n\nfix(field): a field's own disabled locks its control on both render paths",
          "timestamp": "2026-10-05T08:57:43-05:00",
          "tree_id": "3fb7d5c3912e5b64fc68958067161800b6057d55",
          "url": "https://github.com/jonattanva/luna-form/commit/9b772eb80d722e9f86b98cda0cbaa48605798ed2"
        },
        "date": 1791208718013,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003183604600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010867142800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00012646473999999898,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00039127707999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005645476000000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02009522438,
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
          "id": "43b68a0816135ba0f7c26dc163111bfdb29bf9f6",
          "message": "Merge pull request #111 from jonattanva/claude/date-limits\n\nfeat(date): a date can be held between a first and a last day",
          "timestamp": "2026-10-05T08:58:22-05:00",
          "tree_id": "1a39c11ba8a030fadfdd44142a8e49f948193ad5",
          "url": "https://github.com/jonattanva/luna-form/commit/43b68a0816135ba0f7c26dc163111bfdb29bf9f6"
        },
        "date": 1791208755291,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0004874992400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010759595199999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014372029999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004370263399999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005903775600000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02014581632,
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
          "id": "7630798e8122974a1ff2c46ffe6c9ef5696e9b0f",
          "message": "Merge pull request #112 from jonattanva/claude/date-reserved\n\nfeat(date): days nobody can pick",
          "timestamp": "2026-10-05T09:52:06-05:00",
          "tree_id": "a4fdec00032a21a493ff208a3b7643c31eccb525",
          "url": "https://github.com/jonattanva/luna-form/commit/7630798e8122974a1ff2c46ffe6c9ef5696e9b0f"
        },
        "date": 1791211976280,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033141755999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010281012200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001628577999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004138960800000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006790481399999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02205337242,
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
          "id": "22b0fdc09c05716f2d685dcda8519c73524be18e",
          "message": "Merge pull request #113 from jonattanva/ci/e2e-parallel\n\nci: e2e in six parallel jobs with one report, on ubuntu-26.04",
          "timestamp": "2026-10-05T10:10:18-05:00",
          "tree_id": "6f22cd7d07f9e36bf64673af4295144c7dfe83ac",
          "url": "https://github.com/jonattanva/luna-form/commit/22b0fdc09c05716f2d685dcda8519c73524be18e"
        },
        "date": 1791213067023,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00024844857999999987,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009916841400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014581787999999962,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003437242600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004624318600000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.015880997439999996,
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
          "id": "9e9cf5a1ee21c03e704e5a1cd5d8dd3ee12a7be3",
          "message": "Merge pull request #115 from jonattanva/dependabot/npm_and_yarn/examples/with-next-vanilla/next-16.3.6\n\nbuild(deps): bump next from 16.3.5 to 16.3.6 in /examples/with-next-vanilla",
          "timestamp": "2026-10-05T10:48:42-05:00",
          "tree_id": "62d389fde6726992ff6d205ea80ac79aaf61b137",
          "url": "https://github.com/jonattanva/luna-form/commit/9e9cf5a1ee21c03e704e5a1cd5d8dd3ee12a7be3"
        },
        "date": 1791215372896,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00019552367999999974,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006267219999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010095131999999978,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022415031999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003353963399999998,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013078555419999999,
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
          "id": "5fc57d69f19186454fa3859063abe790e943cc6a",
          "message": "Merge pull request #114 from jonattanva/claude/date-range\n\nfeat(date): a range of days in one field",
          "timestamp": "2026-10-05T10:48:32-05:00",
          "tree_id": "bfa1a35b25ee842c15cc5eda20e6300c23811b47",
          "url": "https://github.com/jonattanva/luna-form/commit/5fc57d69f19186454fa3859063abe790e943cc6a"
        },
        "date": 1791215386499,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00030234440000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010507234200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016538871999999968,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004304055800000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005662161200000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02350543392,
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
          "id": "68aa2cac8251e6b1cfb08c2c14ddd4b9846ca095",
          "message": "Merge pull request #116 from jonattanva/claude/date-docs\n\ndocs(date): how a calendar plugs into a date field",
          "timestamp": "2026-10-05T11:10:44-05:00",
          "tree_id": "0be0fa7ba22c1db537e453f237d0697b469b625c",
          "url": "https://github.com/jonattanva/luna-form/commit/68aa2cac8251e6b1cfb08c2c14ddd4b9846ca095"
        },
        "date": 1791216695873,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020108180000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007262146800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008853773999999987,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022476380000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003543562800000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013016586579999998,
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
          "id": "2ddc073e0f29eb555717bc51d23ab4118e8584f5",
          "message": "Merge pull request #117 from jonattanva/claude/date-clock\n\nfeat(date): the host says what time it is",
          "timestamp": "2026-10-05T11:40:45-05:00",
          "tree_id": "26514d4a20581717f0dda6e8f67ca130b06ea41c",
          "url": "https://github.com/jonattanva/luna-form/commit/2ddc073e0f29eb555717bc51d23ab4118e8584f5"
        },
        "date": 1791218493063,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00016832193999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0005881648000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010034456000000034,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022878807999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003603732600000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.012778306420000001,
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
          "id": "1364ef26c2f44487b37b1fae8e4cb9f1cd77fa79",
          "message": "Merge pull request #118 from jonattanva/claude/date-language\n\nfeat(i18n): a form speaks one language, its lang",
          "timestamp": "2026-10-05T12:02:34-05:00",
          "tree_id": "3437f801e35f10c0a14a8b883807123d21ff6cd8",
          "url": "https://github.com/jonattanva/luna-form/commit/1364ef26c2f44487b37b1fae8e4cb9f1cd77fa79"
        },
        "date": 1791219815821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003174639000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011058597400000008,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001505435399999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004238787000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006042087600000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02308696978,
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
          "id": "d9b334973950cd571813b9946166b0bf18d702b8",
          "message": "Merge pull request #119 from jonattanva/claude/date-strict\n\nfix(date): a rule the form cannot read takes no day",
          "timestamp": "2026-10-05T12:33:04-05:00",
          "tree_id": "54065c4acf03e53c8e57555022e984f80854500a",
          "url": "https://github.com/jonattanva/luna-form/commit/d9b334973950cd571813b9946166b0bf18d702b8"
        },
        "date": 1791221636324,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003274762000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010571806000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014686105999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00039562986000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006071346000000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0235975756,
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
          "id": "4b535b42862833180a0007f81734450e39cebc60",
          "message": "Merge pull request #120 from jonattanva/fix/field-own-disabled\n\ntest(e2e): type only once a select has finished closing",
          "timestamp": "2026-10-05T13:06:16-05:00",
          "tree_id": "729afb5c508e8f8f4307dde160ddb0046706d160",
          "url": "https://github.com/jonattanva/luna-form/commit/4b535b42862833180a0007f81734450e39cebc60"
        },
        "date": 1791223615626,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00016055346000000013,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0005922569599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008081243999999969,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00020637530000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00034641468000000034,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01226695646,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "79ecc7724af7574db60e661abe8cfc7f57206efe",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-05T13:12:58-05:00",
          "tree_id": "02e2f4f9e09b0734fb6a7dba51b7973f3834bfb3",
          "url": "https://github.com/jonattanva/luna-form/commit/79ecc7724af7574db60e661abe8cfc7f57206efe"
        },
        "date": 1791224020988,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00022274238000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006999600600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011063422000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00027674465999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00045526436000000044,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.015041407519999998,
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
          "id": "e4124f583509c08044d97963a27caaa5c733a128",
          "message": "Merge pull request #121 from jonattanva/fix/length-bound-unreadable\n\nfix(schema): hold back a field whose length bound is no number",
          "timestamp": "2026-10-05T17:20:51-05:00",
          "tree_id": "d84e24291f468a2d82af0070c513e94ef5f6ffbb",
          "url": "https://github.com/jonattanva/luna-form/commit/e4124f583509c08044d97963a27caaa5c733a128"
        },
        "date": 1791238904194,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0008318882000000007,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008276894800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001218426999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00033997479999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004567602399999987,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01569620216,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b15e15f4a49c7c29df637fc4fc3be8abbaa83c8f",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-05T19:51:37-05:00",
          "tree_id": "3b21366fba9dfc02530c82b88825ed7a35b38442",
          "url": "https://github.com/jonattanva/luna-form/commit/b15e15f4a49c7c29df637fc4fc3be8abbaa83c8f"
        },
        "date": 1791247935983,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0005915216400000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00082978612,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010714510000000019,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003420662600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00045161598000000025,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016593781239999997,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "045eb22286fef22f030a6aae7a3d77326ce957d4",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-06T10:45:20-05:00",
          "tree_id": "1e35390ed3b2dd4e48f9f5a3defa1e7965bc0cd4",
          "url": "https://github.com/jonattanva/luna-form/commit/045eb22286fef22f030a6aae7a3d77326ce957d4"
        },
        "date": 1791301579626,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036512782000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010491734400000007,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.000140401159999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040584115999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006213453599999991,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023862531,
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
          "id": "df1df49e75c7e322d459947d44e35628e3b91407",
          "message": "Merge pull request #122 from jonattanva/feat/list-fixed-and-parent-preview\n\nfeat(list): fixed lists, previews of the row above, and a badge that stays in",
          "timestamp": "2026-10-20T11:23:21-05:00",
          "tree_id": "7ea745167f4626b788e8a8e5351e71d898f97161",
          "url": "https://github.com/jonattanva/luna-form/commit/df1df49e75c7e322d459947d44e35628e3b91407"
        },
        "date": 1792513451319,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003436282799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010426738800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001657892599999991,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004003399200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006047447999999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02392023322,
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
          "id": "fb4fc607c3f0aae99d2e43ce230e316c071685c6",
          "message": "Merge pull request #124 from jonattanva/fix/column-all-hidden\n\nfix(column): no room for a column whose fields are all hidden",
          "timestamp": "2026-10-20T15:10:29-05:00",
          "tree_id": "b72d327ac6bc0eee14fbf1f624c82995bfc737bf",
          "url": "https://github.com/jonattanva/luna-form/commit/fb4fc607c3f0aae99d2e43ce230e316c071685c6"
        },
        "date": 1792527071174,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0001652886799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006420738599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00012376829999999984,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002128350999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00031489260000000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01304492442,
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
          "id": "13a0a696a5797c394bcaeac7604c72ca40c37abd",
          "message": "Merge pull request #123 from jonattanva/claude/jotai-v2-v3-migration-7e91a9\n\nchore(deps): migrate jotai from v2 to v3",
          "timestamp": "2026-10-20T15:12:06-05:00",
          "tree_id": "b09bc18b463479c58c74933b56e8743eb34df5c7",
          "url": "https://github.com/jonattanva/luna-form/commit/13a0a696a5797c394bcaeac7604c72ca40c37abd"
        },
        "date": 1792527169082,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027867079999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008372378400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001204114999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003451736599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00048463976000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016114196,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "77375f47af2f9736c3366e7ecc923e6af0346d6b",
          "message": "upgrade dependencie",
          "timestamp": "2026-10-20T15:15:15-05:00",
          "tree_id": "99d5ed3028e6df5e87b38af335a42304c7c6654a",
          "url": "https://github.com/jonattanva/luna-form/commit/77375f47af2f9736c3366e7ecc923e6af0346d6b"
        },
        "date": 1792527363907,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003345431199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00106293024,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013919700000000035,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003958804399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006066959600000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023098531460000005,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c29a8cfc28287871e9725c8732b3d10653d916b2",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-20T15:35:55-05:00",
          "tree_id": "cc3682b2deac08b2645cf078d7b52eca1ae02195",
          "url": "https://github.com/jonattanva/luna-form/commit/c29a8cfc28287871e9725c8732b3d10653d916b2"
        },
        "date": 1792528615200,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003265095199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010598454799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001452108199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003955866800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005858316600000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02299730222,
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
          "id": "4641fe1e5af30fc4c54a4635d39b10871cf163ab",
          "message": "Merge pull request #125 from jonattanva/claude/state-on-host-value\n\nfix(state): re-run state rules on a value the host changes",
          "timestamp": "2026-10-25T22:29:24-05:00",
          "tree_id": "88657eb05415327302a91c6925146088341a029a",
          "url": "https://github.com/jonattanva/luna-form/commit/4641fe1e5af30fc4c54a4635d39b10871cf163ab"
        },
        "date": 1792985406786,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00018992849999999975,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006281342999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0000892970200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002185215199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003283823000000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013192960980000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "958ebc8ceea549e8b5104f1512eccb37a4522251",
          "message": "format files",
          "timestamp": "2026-10-25T23:00:32-05:00",
          "tree_id": "9f279b006f9de03db6ba4bcaaaa5603f05e59a46",
          "url": "https://github.com/jonattanva/luna-form/commit/958ebc8ceea549e8b5104f1512eccb37a4522251"
        },
        "date": 1792987281168,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00032070595999999965,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00108347282,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016174104000000057,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00044292896000000043,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006307553799999993,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02111109936,
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
          "id": "e05d0377af5a70c4fc595bba89e67cbd145ce8c5",
          "message": "Merge pull request #126 from jonattanva/claude/host-put-back-defaults\n\nfix(state): tell a host putting values back only about what it holds",
          "timestamp": "2026-10-25T23:58:07-05:00",
          "tree_id": "b8ae9183abb6eb578935129679603720fa2d2f85",
          "url": "https://github.com/jonattanva/luna-form/commit/e05d0377af5a70c4fc595bba89e67cbd145ce8c5"
        },
        "date": 1792990730052,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002619304399999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008308952199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001268082800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00034364346000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004525753000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016578848400000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "2f24cee8c659d5fdeaa3e608bbe8b32c4ae17799",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-26T08:59:14-05:00",
          "tree_id": "5b2e6c435c3fae3731dcc53580203bccd2b46d7f",
          "url": "https://github.com/jonattanva/luna-form/commit/2f24cee8c659d5fdeaa3e608bbe8b32c4ae17799"
        },
        "date": 1793023207554,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0001938461399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006320666,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008058062000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022287053999999956,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003323226999999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013346765580000001,
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
          "id": "a1ac253cdaa43846db1461e2a02f169ff2094dde",
          "message": "Merge pull request #128 from jonattanva/claude/list-toggle-row-name-65ab62\n\nfix(list): name a row's toggle after the label it shows",
          "timestamp": "2026-10-26T12:26:48-05:00",
          "tree_id": "8490bfa70f44cefb447abfe2250dbb64d35502ce",
          "url": "https://github.com/jonattanva/luna-form/commit/a1ac253cdaa43846db1461e2a02f169ff2094dde"
        },
        "date": 1793035658760,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003403187600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010648022600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00017240026000000058,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041165954000000054,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005525420999999994,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023516812440000003,
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
          "id": "0a6eb1ab2f278c89b047d100deb3e5ddef081ec9",
          "message": "Merge pull request #129 from jonattanva/claude/list-rows-steady-5fad83\n\nperf(list): a keystroke in a row renders no row of the list",
          "timestamp": "2026-10-26T12:39:18-05:00",
          "tree_id": "ddea5ff8ac2078e453301462c7cd0439c3c378e3",
          "url": "https://github.com/jonattanva/luna-form/commit/0a6eb1ab2f278c89b047d100deb3e5ddef081ec9"
        },
        "date": 1793036398870,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00018481427999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00071964968,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008341314000000011,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002393838199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003995328000000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013747763380000002,
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
          "id": "189adf91d31a9b4a6f24dfbb232e441c095cb9c6",
          "message": "Merge pull request #127 from jonattanva/claude/label-names-group-fields\n\nfix(label): name a group of controls after its label",
          "timestamp": "2026-10-26T13:24:17-05:00",
          "tree_id": "8ce9c32710682fdcc7f1ca4c0466ddaeedf08b03",
          "url": "https://github.com/jonattanva/luna-form/commit/189adf91d31a9b4a6f24dfbb232e441c095cb9c6"
        },
        "date": 1793039111468,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003161463200000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010506174000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013932436000000054,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003999803399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005563064399999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02320278218,
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
          "id": "72da7749ca5fdc6e9047135f23e76c06f0e843e8",
          "message": "Merge pull request #131 from jonattanva/claude/fix-collapsible-preview-remove-name\n\ntest(list): name the remove button after the row label it shows",
          "timestamp": "2026-10-26T17:29:09-05:00",
          "tree_id": "880877dc0a432536ef11e00c358c98bd68da87d7",
          "url": "https://github.com/jonattanva/luna-form/commit/72da7749ca5fdc6e9047135f23e76c06f0e843e8"
        },
        "date": 1793053791404,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020939673999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006579489800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009888230000000022,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022375293999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003748244400000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01300399948,
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
          "id": "b7ae4c526b419201cdfbc20b17d0263f280e732f",
          "message": "Merge pull request #130 from jonattanva/claude/zod-optimization-react-luna-form-4ea521\n\nperf(schema): import zod as a namespace so bundlers can shake it",
          "timestamp": "2026-10-26T19:11:50-05:00",
          "tree_id": "cb258a50e9d1688ca5ff5233d8b0b2998594a588",
          "url": "https://github.com/jonattanva/luna-form/commit/b7ae4c526b419201cdfbc20b17d0263f280e732f"
        },
        "date": 1793059958071,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002697490199999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008271473999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011304005999999959,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00031916615999999975,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005067467799999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01643059614,
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
          "id": "6c1cf502bce3772403a392c0bda2d15ec6ed849e",
          "message": "Merge pull request #133 from jonattanva/claude/stable-browser-benchmark\n\ntest(perf): measure the browser benchmark in-page, as a median",
          "timestamp": "2026-10-26T19:55:53-05:00",
          "tree_id": "9aaa6561902c2bd2537b3803ac02bfd8d2ad69b4",
          "url": "https://github.com/jonattanva/luna-form/commit/6c1cf502bce3772403a392c0bda2d15ec6ed849e"
        },
        "date": 1793062584018,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00030584851999999955,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010588000400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013420901999999956,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004269099200000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006221819000000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023525384979999998,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "d41ff5642acbe8b4aea37c303cf01fbe19abea59",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-26T19:56:34-05:00",
          "tree_id": "598366c3208857e6a20c5e699388d105739aa18c",
          "url": "https://github.com/jonattanva/luna-form/commit/d41ff5642acbe8b4aea37c303cf01fbe19abea59"
        },
        "date": 1793062658370,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00031308036000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010660494200000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001736548000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042206042000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005952149000000009,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0237648984,
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
          "id": "9ad3679fa9350e6eaf1800e0ec38c2993505a814",
          "message": "Merge pull request #134 from jonattanva/claude/built-in-select-mount-events\n\nfix(select): run a built-in selector's change events at mount",
          "timestamp": "2026-10-28T19:47:08-05:00",
          "tree_id": "58efbbc060b893a8f6b7b9c43b2e2ba71e07ace9",
          "url": "https://github.com/jonattanva/luna-form/commit/9ad3679fa9350e6eaf1800e0ec38c2993505a814"
        },
        "date": 1793234874232,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002702810999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010596997999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001415269599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00037214255999999977,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005589637800000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02197460854,
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
          "id": "db4daedce9553614a79392caf4f8b453f8f662b8",
          "message": "Merge pull request #135 from jonattanva/claude/yes-no-unanswered\n\nfix(schema): treat an unanswered Yes/No as no answer",
          "timestamp": "2026-10-30T19:47:39-05:00",
          "tree_id": "a448272a2da9383fe80c231da4b7c81a895220e9",
          "url": "https://github.com/jonattanva/luna-form/commit/db4daedce9553614a79392caf4f8b453f8f662b8"
        },
        "date": 1793407711645,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003023085199999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009910818,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001303814799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004035480400000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005326587599999993,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.022118811000000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "8f5bda714428aad7dc8211ddcbd35343e6afe6cd",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-30T19:57:51-05:00",
          "tree_id": "ceb5b2dcf854372bf57b622b8bc89214d84986d1",
          "url": "https://github.com/jonattanva/luna-form/commit/8f5bda714428aad7dc8211ddcbd35343e6afe6cd"
        },
        "date": 1793408307933,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00017313513999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006465410200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008593171999999981,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00023544543999999974,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003426149600000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013238986679999998,
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
          "id": "256a8a39830a2eab0bd54d1b54c3ee6a7527b878",
          "message": "Merge pull request #136 from jonattanva/claude/yes-no-default\n\nfix(schema): read an empty Yes/No as its default answer",
          "timestamp": "2026-10-31T00:27:43-05:00",
          "tree_id": "584e4f0efe62bbf1f68078fcfd67c7f7780e0c17",
          "url": "https://github.com/jonattanva/luna-form/commit/256a8a39830a2eab0bd54d1b54c3ee6a7527b878"
        },
        "date": 1793424506903,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003012875200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010474125999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001507731000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003964970399999993,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005781163200000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0234374346,
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
          "id": "73a9c9b26cf0a7d46d9d61c4340c0a8708a10fb4",
          "message": "Merge pull request #137 from jonattanva/claude/keepvalue-nested-list-rows-b28513\n\nfix(list): give a kept nested list its rows back when it is shown again",
          "timestamp": "2026-11-03T15:14:19-05:00",
          "tree_id": "3f4e9a971702590ced306a535f512c29f276fa5c",
          "url": "https://github.com/jonattanva/luna-form/commit/73a9c9b26cf0a7d46d9d61c4340c0a8708a10fb4"
        },
        "date": 1793736932159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00035643439999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0013769280599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001375565400000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004965287000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0007981229399999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.025318771079999997,
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
          "id": "1ae9971acfc4e39193c70cb716e0b324fce6909b",
          "message": "Merge pull request #138 from jonattanva/claude/fixed-options\n\nfeat(schema): hold a field to the options its definition writes",
          "timestamp": "2026-11-03T15:18:23-05:00",
          "tree_id": "c0fd7f71fdfc2cf5abb2ba00a9c6e51a123c0686",
          "url": "https://github.com/jonattanva/luna-form/commit/1ae9971acfc4e39193c70cb716e0b324fce6909b"
        },
        "date": 1793737162020,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003278436399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010511207000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00015167867999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00042471473999999946,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006249780399999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023733406219999996,
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
          "id": "6a02621cfaab50a0ca42bc4d5e25c11f2b47c46c",
          "message": "Merge pull request #140 from jonattanva/claude/max-params\n\nchore(lint): hold the library's functions to four parameters",
          "timestamp": "2026-11-03T15:18:36-05:00",
          "tree_id": "c8eee4fbf1e896a4b1bb811fd101023b470f1fcf",
          "url": "https://github.com/jonattanva/luna-form/commit/6a02621cfaab50a0ca42bc4d5e25c11f2b47c46c"
        },
        "date": 1793737177138,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002632969399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00082773982,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011502838000000054,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00033698256000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004441958200000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01616390736,
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
          "id": "4b92dbdff68a5bf0650eb88530d7e2028f4a34c6",
          "message": "Merge pull request #141 from jonattanva/claude/held-options-to-main\n\nfix(form): check the value a field holds when its options cannot show it",
          "timestamp": "2026-11-03T15:37:23-05:00",
          "tree_id": "0de11970074337d8d59282c86e262626660b607b",
          "url": "https://github.com/jonattanva/luna-form/commit/4b92dbdff68a5bf0650eb88530d7e2028f4a34c6"
        },
        "date": 1793738300167,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00024871846000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008146838199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00012056938000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003335107000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005052325200000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.019044737460000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "44e0c0308c691005faf1f8093c75660e6034bdca",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-03T15:54:11-05:00",
          "tree_id": "a3aa20296c34ae25f673a1a2dbf0508642de953d",
          "url": "https://github.com/jonattanva/luna-form/commit/44e0c0308c691005faf1f8093c75660e6034bdca"
        },
        "date": 1793739315658,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003181396599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010534795799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014305786000000012,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004291396800000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005767289600000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023802247819999997,
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
          "id": "12ef539bfd4ec4d64e42fe9372e72d74cb130ffa",
          "message": "Merge pull request #142 from jonattanva/claude/date-fns-direct-imports\n\nperf(date): import each date-fns function and locale by its own path",
          "timestamp": "2026-11-03T22:14:42-05:00",
          "tree_id": "e362391e07e942b7b442c82771658323144adcc1",
          "url": "https://github.com/jonattanva/luna-form/commit/12ef539bfd4ec4d64e42fe9372e72d74cb130ffa"
        },
        "date": 1793762136421,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003055835000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010677631599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016949515999999904,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040652216000000064,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0007882157800000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023588988720000002,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "843c2cb549b99dd41e4cd3eefb7949a138a4d547",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-03T22:55:06-05:00",
          "tree_id": "fc65c9323250e0162df52ff591c7817c4e128fc4",
          "url": "https://github.com/jonattanva/luna-form/commit/843c2cb549b99dd41e4cd3eefb7949a138a4d547"
        },
        "date": 1793764558819,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00032810624000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010471139399999992,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014131156000000034,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004203111200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005754991800000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02379597414,
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
          "id": "77d60399a4d77564a19cc6c8b2825bda2250248f",
          "message": "Merge pull request #143 from jonattanva/claude/transform-typed-only\n\nfix(input): keep a value the form receives as it came",
          "timestamp": "2026-11-08T13:20:24-05:00",
          "tree_id": "63ceeba62485ce6564fc4244e0de302f9eeed266",
          "url": "https://github.com/jonattanva/luna-form/commit/77d60399a4d77564a19cc6c8b2825bda2250248f"
        },
        "date": 1794162071837,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00032280888000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010327001199999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013457520000000045,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004167918999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00064022922,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.026180035200000003,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "70499909fd71b33b0f6776ce66bdda89f0016137",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-08T13:22:33-05:00",
          "tree_id": "8db49208331bc714cbbc223aba6742b7f38efa89",
          "url": "https://github.com/jonattanva/luna-form/commit/70499909fd71b33b0f6776ce66bdda89f0016137"
        },
        "date": 1794162212973,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003046737200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010809520800000008,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001400489600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003972930399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005943032200000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023065827320000003,
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
          "id": "e8c61ac5ecb5e60cd614e329175f22d8a9727bf7",
          "message": "Merge pull request #144 from jonattanva/claude/render-bundle-cleanup\n\nperf: cut renders and up-front JavaScript the form does not need, and remove duplicate and dead code",
          "timestamp": "2026-11-09T11:33:36-05:00",
          "tree_id": "1869a3353ff1d59cc75ccfa46f54f2b2ad6dfcf1",
          "url": "https://github.com/jonattanva/luna-form/commit/e8c61ac5ecb5e60cd614e329175f22d8a9727bf7"
        },
        "date": 1794242060141,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003004327599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010802647199999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013637924,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003965853200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005734236800000007,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02389673694,
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
          "id": "6720fe726252828cf8663d7d2c0f13c0b6102b73",
          "message": "Merge pull request #145 from jonattanva/claude/transform-typed-text\n\nfix(input): rewrite only what the user types, not the text it kept",
          "timestamp": "2026-11-09T14:02:09-05:00",
          "tree_id": "d1fd4ac967e91fe92ffef37f483c66140ba497a9",
          "url": "https://github.com/jonattanva/luna-form/commit/6720fe726252828cf8663d7d2c0f13c0b6102b73"
        },
        "date": 1794250972553,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002150936999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006992447400000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011734390000000019,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002927272600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00045861653999999986,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01741633448,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "8c184482692afe52c6a92fdb2a40a5bc1dcb9568",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-09T14:10:48-05:00",
          "tree_id": "da969ae11c857eb05fb5cbb2380039b7ae0b9ee2",
          "url": "https://github.com/jonattanva/luna-form/commit/8c184482692afe52c6a92fdb2a40a5bc1dcb9568"
        },
        "date": 1794251494407,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00029379955999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00106098682,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013329880000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00039869151999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005757477200000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023195993159999997,
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
          "id": "9debe8a58551b1350d9532472533550b74c2de79",
          "message": "Merge pull request #146 from jonattanva/claude/declared-list-rows\n\nfix(form): name the fields a list's rows leave out in withDeclaredFields",
          "timestamp": "2026-11-16T00:47:47-05:00",
          "tree_id": "3ce2f4b9da3410df83c884dbec0521182a178ae7",
          "url": "https://github.com/jonattanva/luna-form/commit/9debe8a58551b1350d9532472533550b74c2de79"
        },
        "date": 1794808109581,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002454866399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008385651400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011533770000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00032449474000000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004822930399999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016118375679999998,
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
          "id": "a9930285de1c8591d36674c0adca373c80b24431",
          "message": "Merge pull request #147 from jonattanva/claude/agent-tools\n\nAgent tools: plan, phase 0 prototype and the tool schema",
          "timestamp": "2026-11-16T16:01:49-05:00",
          "tree_id": "1a389f9b69a854f97704d7d460c63db1b7a603c5",
          "url": "https://github.com/jonattanva/luna-form/commit/a9930285de1c8591d36674c0adca373c80b24431"
        },
        "date": 1794862955246,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00030239081999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010738156800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001338889000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003948730999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006511818800000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023601935560000002,
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
          "id": "fa696793f02a51e02e56c940a509c05d18af1ec7",
          "message": "Merge pull request #148 from jonattanva/dependabot/npm_and_yarn/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5",
          "timestamp": "2026-11-17T15:37:49-05:00",
          "tree_id": "2c0d3d744f435c26d1a39e1137a72824cad89226",
          "url": "https://github.com/jonattanva/luna-form/commit/fa696793f02a51e02e56c940a509c05d18af1ec7"
        },
        "date": 1794947905287,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00026875380000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009584042800000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001594584400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00035379040000000034,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005727024600000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.021426578139999996,
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
          "id": "38f28fece87d4a71180df783f79d1571cceff420",
          "message": "Merge pull request #149 from jonattanva/claude/agent-apply\n\nAgent tools: write a field from outside, and the four form tools",
          "timestamp": "2026-11-17T15:39:39-05:00",
          "tree_id": "e18a97805b8bb371e3a2b727d13037fb9f451575",
          "url": "https://github.com/jonattanva/luna-form/commit/38f28fece87d4a71180df783f79d1571cceff420"
        },
        "date": 1794948025074,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002683947599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008314773000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001243339599999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00034305345999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004618110200000001,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0163645212,
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
          "id": "8861e214b10c6bf7b517570c6aefc029686208cb",
          "message": "Merge pull request #150 from jonattanva/claude/agent-host\n\nAgent tools: the agent prop, the real host, WebMCP and callTool",
          "timestamp": "2026-11-17T15:42:23-05:00",
          "tree_id": "e657a0288fcfe1c79619fb232a1f6665c6dcf86e",
          "url": "https://github.com/jonattanva/luna-form/commit/8861e214b10c6bf7b517570c6aefc029686208cb"
        },
        "date": 1794948208463,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00033859148000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010766548999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013986928000000036,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.000433552380000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00057929712,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0224352851,
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
          "id": "b9ac695cfede877ffa11f1387a4540d655c3d551",
          "message": "Merge pull request #151 from jonattanva/dependabot/npm_and_yarn/examples/with-next-vanilla/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5 in /examples/with-next-vanilla",
          "timestamp": "2026-11-17T15:56:35-05:00",
          "tree_id": "2e8741aad0316535f65df5795cb669f2961449f7",
          "url": "https://github.com/jonattanva/luna-form/commit/b9ac695cfede877ffa11f1387a4540d655c3d551"
        },
        "date": 1794949047821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00021257321999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006279563400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0000984106399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00021034626000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00034827001999999994,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01302545302,
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
          "id": "113493c44c59138467a37ef6149d0fc285a445e2",
          "message": "Merge pull request #152 from jonattanva/dependabot/npm_and_yarn/examples/with-next-shadcn/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5 in /examples/with-next-shadcn",
          "timestamp": "2026-11-17T16:06:47-05:00",
          "tree_id": "e46272dcbbe145ca7818ecfdae1be93d3e6bcec4",
          "url": "https://github.com/jonattanva/luna-form/commit/113493c44c59138467a37ef6149d0fc285a445e2"
        },
        "date": 1794949647809,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003067701999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011047941999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00020409672000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0005241802799999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00074989868,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0245720035,
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
          "id": "1b54bbc233c0cb0230d44afed0a79e39d982c1ef",
          "message": "Merge pull request #153 from jonattanva/claude/agent-leaf-paths\n\nAgent tools: write one field of one row by its route",
          "timestamp": "2026-11-17T16:17:33-05:00",
          "tree_id": "b3694408d0a8df6f393fe940a95a323e3614df67",
          "url": "https://github.com/jonattanva/luna-form/commit/1b54bbc233c0cb0230d44afed0a79e39d982c1ef"
        },
        "date": 1794950315370,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027517042000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008407295800000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013093340000000012,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00034424908000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005082711400000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01614848386,
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
          "id": "89e99599852b6a9ede8046ee994277ad371bcb84",
          "message": "Merge pull request #154 from jonattanva/claude/agent-custom-types\n\nAgent tools: custom type schemas, and the fill latency",
          "timestamp": "2026-11-17T20:50:07-05:00",
          "tree_id": "f1704a4d953831703a012c448de8be4b6e04de42",
          "url": "https://github.com/jonattanva/luna-form/commit/89e99599852b6a9ede8046ee994277ad371bcb84"
        },
        "date": 1794966647379,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00018347443999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006707030400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011807834000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002264975999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003689508799999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01260948574,
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
          "id": "31a896fbf1da38170f2bea7ed971ffa7f42688a8",
          "message": "Merge pull request #155 from jonattanva/claude/agent-bundle\n\nAgent tools: load build, registration and submit on demand, and three bundle budgets",
          "timestamp": "2026-11-17T20:50:20-05:00",
          "tree_id": "01bf21fcfd0ec83dfc87d5ee70cac051aa3a8f12",
          "url": "https://github.com/jonattanva/luna-form/commit/31a896fbf1da38170f2bea7ed971ffa7f42688a8"
        },
        "date": 1794966667679,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002682726600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008597397800000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001302007000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00034626278000000015,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00045195143999999973,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01624793596,
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
          "id": "00fab0f66e87807ff1825a1f46900597c86c434c",
          "message": "Merge pull request #156 from jonattanva/claude/agent-e2e\n\nAgent tools: end-to-end coverage with real WebMCP, and the before and after measurement",
          "timestamp": "2026-11-17T21:45:28-05:00",
          "tree_id": "0c29f31308b28a5e62935178a57a0c44e12f2bcd",
          "url": "https://github.com/jonattanva/luna-form/commit/00fab0f66e87807ff1825a1f46900597c86c434c"
        },
        "date": 1794969967612,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00018598678000000007,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006091033399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008171303999999963,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022864664000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00035724877999999987,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013016142960000003,
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
          "id": "85a1a32c77b0b6cba4c61fa18c6727b557fd74dc",
          "message": "Merge pull request #157 from jonattanva/claude/replayed-change-events\n\nMove the replayed change events out of InputBase into useReplayedChangeEvents",
          "timestamp": "2026-11-17T22:00:38-05:00",
          "tree_id": "9b993382ab653386aa94712442421f6c2a01d799",
          "url": "https://github.com/jonattanva/luna-form/commit/85a1a32c77b0b6cba4c61fa18c6727b557fd74dc"
        },
        "date": 1794970883070,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00025757431999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008446076599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010643272000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003295328999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005156474000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01618586224,
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
          "id": "542c98c4a6d484c38ec50fad31672fc1f3d5af5e",
          "message": "Merge pull request #158 from jonattanva/claude/validation-messages\n\nValidation messages in the library's words and the form's language",
          "timestamp": "2026-11-17T22:49:26-05:00",
          "tree_id": "bf1b9fa1e09e0cbf3f5406a338173c79af12f889",
          "url": "https://github.com/jonattanva/luna-form/commit/542c98c4a6d484c38ec50fad31672fc1f3d5af5e"
        },
        "date": 1794973802578,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00016522690000000012,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006142542800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008603359999999952,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00024371111999999982,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00038147984000000006,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01240450922,
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
          "id": "d43e7a7b6ebfdf529c4ea4e36f772c328e97410f",
          "message": "Merge pull request #159 from jonattanva/claude/reset-after-submit\n\nfix(react): start the form over on a store of its own after a successful submit",
          "timestamp": "2026-11-18T07:34:02-05:00",
          "tree_id": "dda39d9e7b4cfd4b9bea44f9c5aed99ffe3dee7c",
          "url": "https://github.com/jonattanva/luna-form/commit/d43e7a7b6ebfdf529c4ea4e36f772c328e97410f"
        },
        "date": 1795005304637,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002458810200000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00074219112,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014118207999999982,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002965026,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004500890199999998,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0163754468,
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
          "id": "8781a671c1bc2a83d5639a29b858f358bc942e82",
          "message": "Merge pull request #160 from jonattanva/claude/close-phase-1\n\ndocs(plan): close phase 1 with the acceptance criteria met and what moves on to phases 2 and 3",
          "timestamp": "2026-11-18T07:51:50-05:00",
          "tree_id": "fa59f31bc8e92b0366c7bcb79b78736a3504100e",
          "url": "https://github.com/jonattanva/luna-form/commit/8781a671c1bc2a83d5639a29b858f358bc942e82"
        },
        "date": 1795006339001,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00016473381999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00059781452,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008316840000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00021663307999999972,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00031748663999999963,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.012638538579999999,
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
          "id": "c1b658d8f5e3e111908f59563ea444536d5620e0",
          "message": "Merge pull request #161 from jonattanva/claude/settle-under-load\n\nfix(react): wait for the page to draw a field a fill reveals or unlocks",
          "timestamp": "2026-11-18T10:17:58-05:00",
          "tree_id": "2fe272317a4228ddfc0cd8820e8321469a5c6f60",
          "url": "https://github.com/jonattanva/luna-form/commit/c1b658d8f5e3e111908f59563ea444536d5620e0"
        },
        "date": 1795015143822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00023092104000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007548686200000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001004952800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002821065599999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004304067400000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.015767972760000002,
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
          "id": "06152c6519556fed46e979489ba3cdf1603a6325",
          "message": "Merge pull request #162 from jonattanva/claude/bundle-margin\n\nci: raise the bundle budgets to 400 kB total and 33 kB gzip on the main path, with the figures they guard",
          "timestamp": "2026-11-18T11:30:40-05:00",
          "tree_id": "c28a27ab9ce43fa079e7778485455a64c168bb7f",
          "url": "https://github.com/jonattanva/luna-form/commit/06152c6519556fed46e979489ba3cdf1603a6325"
        },
        "date": 1795019481901,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00036410011999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0012497074399999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013871360000000096,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00047488058000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006556953199999998,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02615611704,
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
          "id": "58885efb7e5493accf77d6f66b63a0f850886c18",
          "message": "Merge pull request #163 from jonattanva/claude/submit-without-validation\n\nfix(react): end a submit that checks nothing the way any other ends",
          "timestamp": "2026-11-18T12:30:23-05:00",
          "tree_id": "f1323c0b2ac87b5886d47f654c43b34a865b0d8e",
          "url": "https://github.com/jonattanva/luna-form/commit/58885efb7e5493accf77d6f66b63a0f850886c18"
        },
        "date": 1795023068180,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00032873619999999957,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010671439999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014499811999999906,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00043450803999999947,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006097346800000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02406944788,
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
          "id": "6e2ad9ef333415a404edb2d4d36bd6aedf80a956",
          "message": "Merge pull request #164 from jonattanva/claude/ci-playwright-image\n\nci: run the e2e tests in the Playwright image instead of installing browser packages on the runner",
          "timestamp": "2026-11-18T12:36:43-05:00",
          "tree_id": "b7df9a6263d9e01131e096d06d24995843372010",
          "url": "https://github.com/jonattanva/luna-form/commit/6e2ad9ef333415a404edb2d4d36bd6aedf80a956"
        },
        "date": 1795023428415,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002954416399999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006666965399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008628229999999973,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022748587999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003766798,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01254814764,
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
          "id": "47892a8e0b32f3783fd278f08aa57692368a1273",
          "message": "Merge pull request #165 from jonattanva/claude/shorter-descriptions\n\nfeat(react): shorter tool descriptions that say whether the submit checks the values",
          "timestamp": "2026-11-18T13:29:22-05:00",
          "tree_id": "132927059073997a7c20fd3c025b5a2c0c58412d",
          "url": "https://github.com/jonattanva/luna-form/commit/47892a8e0b32f3783fd278f08aa57692368a1273"
        },
        "date": 1795026607053,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00029686666000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010593842599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016215147999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041448972000000025,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00060064166,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02327373648,
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
          "id": "784af7e18bd2ca99094b837783a5cce7fc49d0e1",
          "message": "Merge pull request #166 from jonattanva/claude/five-form-measurement\n\ndocs(plan): measure a page of five forms and answer when a grouped mode pays",
          "timestamp": "2026-11-18T13:29:32-05:00",
          "tree_id": "c26b123d4cde27b19b51e29dea20843c324808cf",
          "url": "https://github.com/jonattanva/luna-form/commit/784af7e18bd2ca99094b837783a5cce7fc49d0e1"
        },
        "date": 1795026621301,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00028471589999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009604315600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016196511999999984,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003765388399999995,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005278241000000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0217155084,
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
          "id": "8b2903c76b3627c572f8a5b54a6fef5ea492be7d",
          "message": "Merge pull request #167 from jonattanva/claude/value-change-source\n\nfeat(react): tell onValueChange who made each change",
          "timestamp": "2026-11-18T14:52:28-05:00",
          "tree_id": "edef8f01212df52521c72320ef3ec88aeb55caf3",
          "url": "https://github.com/jonattanva/luna-form/commit/8b2903c76b3627c572f8a5b54a6fef5ea492be7d"
        },
        "date": 1795031608301,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00032715530000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010724427799999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001713069799999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040277063999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005772067600000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02540831324,
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
          "id": "f09e431a87f49bbb0d5a9311ae8dc673544e0e65",
          "message": "Merge pull request #168 from jonattanva/claude/agent-person-changed\n\nfeat(react): keep a fill from writing over what a person changed",
          "timestamp": "2026-11-18T16:37:19-05:00",
          "tree_id": "cdc15058f57c08dc8cb84b97e738ff20edeb8f20",
          "url": "https://github.com/jonattanva/luna-form/commit/f09e431a87f49bbb0d5a9311ae8dc673544e0e65"
        },
        "date": 1795037882859,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020848768000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007526810999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010282895999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003038771200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00047043560000000016,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01606388482,
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
          "id": "e1691e4d672aaf5753757faf5faaba86bfaa0ce1",
          "message": "Merge pull request #169 from jonattanva/claude/agent-highlight\n\nfeat(react): show the person an agent at work on the form",
          "timestamp": "2026-11-18T16:45:11-05:00",
          "tree_id": "f61455b80484056f9c468c77aaa5c78aab2dd08b",
          "url": "https://github.com/jonattanva/luna-form/commit/e1691e4d672aaf5753757faf5faaba86bfaa0ce1"
        },
        "date": 1795038358456,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003304718200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00105367298,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014241442000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040339390000000095,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006447574399999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023800719239999997,
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
          "id": "f42bbb646244dab0a3b5036209ba07a38aad9c07",
          "message": "Merge pull request #170 from jonattanva/claude/remote-options\n\nfeat(react): wait for the options a field fetches, and say what brings them",
          "timestamp": "2026-11-18T18:06:53-05:00",
          "tree_id": "6c2381b7d8e1bff353fd7d32d47705142494a5e6",
          "url": "https://github.com/jonattanva/luna-form/commit/f42bbb646244dab0a3b5036209ba07a38aad9c07"
        },
        "date": 1795043269957,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027301916000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008371807400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011528546000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003331978600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004441709000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016629522620000003,
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
          "id": "3e0681903bf69b2758ffb812edd4a9c3477e7051",
          "message": "Merge pull request #171 from jonattanva/claude/agent-call-log\n\nfeat(react): tell the host of every call an agent makes",
          "timestamp": "2026-11-18T19:51:27-05:00",
          "tree_id": "00c2ab1f283e668ff6f760d991db660b40dc2014",
          "url": "https://github.com/jonattanva/luna-form/commit/3e0681903bf69b2758ffb812edd4a9c3477e7051"
        },
        "date": 1795049533743,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002995783800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010542601999999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013682262000000038,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040498343999999974,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006099931400000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02297108408,
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
          "id": "aaf6992e49e551a07c026b6c0d33d86b033df0d8",
          "message": "Merge pull request #172 from jonattanva/claude/authoring-tools\n\nfeat(editor): let an agent read, write and check the form the editor holds",
          "timestamp": "2026-11-19T12:33:25-05:00",
          "tree_id": "7acbac4382daf45535e373146d078367a3c8f5a9",
          "url": "https://github.com/jonattanva/luna-form/commit/aaf6992e49e551a07c026b6c0d33d86b033df0d8"
        },
        "date": 1795109649937,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020308716000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006795599799999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00008913411999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00025745915999999966,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00037662548000000015,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013235799179999999,
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
          "id": "5d817faa5e000d33f2262b5b5dc0ba9406a4e1a0",
          "message": "Merge pull request #173 from jonattanva/claude/agent-fixed-list\n\nfix(react): keep the rows of a fixed list from an agent, and ask only for what the person gave",
          "timestamp": "2026-11-19T12:33:48-05:00",
          "tree_id": "1c420343342fb941199d1faba77247956bb4662b",
          "url": "https://github.com/jonattanva/luna-form/commit/5d817faa5e000d33f2262b5b5dc0ba9406a4e1a0"
        },
        "date": 1795109676377,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00045708808000000036,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00113426866,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00019735735999999976,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004242780400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006174387200000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.023755080480000003,
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
          "id": "1df3fd47b44456d9bec1da51f129e978bc47d667",
          "message": "Merge pull request #174 from jonattanva/claude/editor-remote-patterns\n\nfix(core): read a source's URL for remotePatterns the way the fetcher calls it",
          "timestamp": "2026-11-19T12:54:20-05:00",
          "tree_id": "55bd70e726e2f628f20b21885d187beee8c5146a",
          "url": "https://github.com/jonattanva/luna-form/commit/1df3fd47b44456d9bec1da51f129e978bc47d667"
        },
        "date": 1795110906981,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027176909999999965,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008341106400000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011292224000000033,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00032761210000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005127316999999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0162085799,
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
          "id": "43dc86aa90f7dd2c31639953da55ef4923872131",
          "message": "Merge pull request #176 from jonattanva/claude/luna-form-command-restructure-8c9f7f\n\nAdd /audit and /test-audit commands with an in-repo findings registry, and their first runs",
          "timestamp": "2026-11-19T13:10:40-05:00",
          "tree_id": "995a959b0b75822828fa22b52c1923eda27f33f2",
          "url": "https://github.com/jonattanva/luna-form/commit/43dc86aa90f7dd2c31639953da55ef4923872131"
        },
        "date": 1795111876988,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0004271081600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008626826800000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00015536786000000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003572497199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005069428200000004,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.017259351000000003,
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
          "id": "3496fc93adfbff5ddb9b0cb13fc592ce26a4bb01",
          "message": "Merge pull request #177 from jonattanva/claude/s-02-unused-exports\n\nStop exporting what nothing imports",
          "timestamp": "2026-11-19T13:20:20-05:00",
          "tree_id": "33aecb37d124cc83e38e434ec9bdd9b2a976f118",
          "url": "https://github.com/jonattanva/luna-form/commit/3496fc93adfbff5ddb9b0cb13fc592ce26a4bb01"
        },
        "date": 1795112460524,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002748956600000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008418512199999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001346564000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00034787574000000006,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00048437347999999984,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01634702482,
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
          "id": "057920a52aba4069b5a67817f0f78a6560d60b0d",
          "message": "Merge pull request #175 from jonattanva/claude/schema-text-length\n\nfix(core): keep long host text out of what an agent reads first",
          "timestamp": "2026-11-19T13:31:18-05:00",
          "tree_id": "b725ecd406be5d8003fe87995298e64f8ca2f4b8",
          "url": "https://github.com/jonattanva/luna-form/commit/057920a52aba4069b5a67817f0f78a6560d60b0d"
        },
        "date": 1795113127524,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00022864304000000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007530527599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010538739999999962,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002845076999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00042773513999999976,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016063156439999997,
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
          "id": "8fa8adf4ce6e2924e60b3bfe3ccd848717dffd21",
          "message": "Merge pull request #179 from jonattanva/claude/remove-preserve-values\n\nrefactor(react): remove the preserveValues option",
          "timestamp": "2026-11-19T13:39:22-05:00",
          "tree_id": "a8eb48c515a0930ca7e75d893f68e194c2504c36",
          "url": "https://github.com/jonattanva/luna-form/commit/8fa8adf4ce6e2924e60b3bfe3ccd848717dffd21"
        },
        "date": 1795113618719,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00026618082000000017,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008362718000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00012394543999999996,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003338155599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004536558199999996,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016316967419999998,
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
          "id": "c4db2d423db0013500e9d50fec2579034ef905f4",
          "message": "Merge pull request #178 from jonattanva/claude/bug-02-resolve-target\n\nfix(core): read a row-relative target's list name as text, not as a pattern",
          "timestamp": "2026-11-19T13:46:30-05:00",
          "tree_id": "03c0d8ce23b84cb372c7199c1b794f967e74cb28",
          "url": "https://github.com/jonattanva/luna-form/commit/c4db2d423db0013500e9d50fec2579034ef905f4"
        },
        "date": 1795114032999,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00024825372000000014,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008279493200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00012784881999999983,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00032378267999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004774823200000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01687471196,
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
          "id": "8df8ac5250fcd33134f76ed5b2ef93d06c296651",
          "message": "Merge pull request #180 from jonattanva/claude/brave-boyd-aee2b6\n\nfix(react): move the focus to the first field with an error after a failed submit",
          "timestamp": "2026-11-19T13:47:07-05:00",
          "tree_id": "3f193e7ca5fa79eca88a08a65ee2c6f1ca2a6ae6",
          "url": "https://github.com/jonattanva/luna-form/commit/8df8ac5250fcd33134f76ed5b2ef93d06c296651"
        },
        "date": 1795114079434,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003454740800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011138644399999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001562787400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00044795619999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0006025481999999999,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.02428180112,
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
          "id": "b2a53eeb9576a0e978071709b7e3092961e42c72",
          "message": "Merge pull request #181 from jonattanva/claude/audit-registry-fixes\n\nRecord the fixes for S-02, BUG-02 and U-02 in the audit registry",
          "timestamp": "2026-11-19T13:58:15-05:00",
          "tree_id": "841cdc1eaa2af2fcbd943d06b58df40fe5ba58d3",
          "url": "https://github.com/jonattanva/luna-form/commit/b2a53eeb9576a0e978071709b7e3092961e42c72"
        },
        "date": 1795114738432,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002668293,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008271688799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010604427999999985,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00035819391999999993,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004854224799999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01670362416,
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
          "id": "296cb52e23486a399d5fcbc44962c36dc26f1177",
          "message": "Merge pull request #182 from jonattanva/claude/raw-submit-failure\n\ntest(e2e): cover a submit that checks nothing and whose action fails",
          "timestamp": "2026-11-19T14:20:38-05:00",
          "tree_id": "a824fd74cbc1d348abce120ce9f590b47cdc8eaf",
          "url": "https://github.com/jonattanva/luna-form/commit/296cb52e23486a399d5fcbc44962c36dc26f1177"
        },
        "date": 1795116100200,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003016179599999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0010564805200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016271929999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0004437562800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00056469022,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0236977326,
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
          "id": "5b2663075d393e62a2cb79e53651aef37e29b045",
          "message": "Merge pull request #183 from jonattanva/claude/nice-gould-5736e0\n\nchore: add the Playwright MCP server and playwright-cli skill for agents",
          "timestamp": "2026-11-19T14:20:48-05:00",
          "tree_id": "888c6be825314f544c27c6dac88adc2973b3a315",
          "url": "https://github.com/jonattanva/luna-form/commit/5b2663075d393e62a2cb79e53651aef37e29b045"
        },
        "date": 1795116104867,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00025138153999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007401210600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009966534000000024,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002887059799999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00043564711999999984,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016121431519999996,
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
          "id": "65c4dd493b3831aa5dbdd68b1034b2a6c4dcd997",
          "message": "Merge pull request #184 from jonattanva/claude/audit-registry-merged\n\nMark BUG-02 and U-02 fixed in the audit registry",
          "timestamp": "2026-11-19T14:46:38-05:00",
          "tree_id": "ed43682626e14dc63dda221cab582c19021e56f5",
          "url": "https://github.com/jonattanva/luna-form/commit/65c4dd493b3831aa5dbdd68b1034b2a6c4dcd997"
        },
        "date": 1795117647312,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00026194615999999995,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.00083286362,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001338764199999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00031854619999999954,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005067854800000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.018602447780000003,
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
          "id": "876f23e33b9139ce3c9d001a87ca9ed2e901025b",
          "message": "Merge pull request #185 from jonattanva/claude/notes-unchecked-submit\n\nfix(core): leave out of the agent schema the rules a submit that checks nothing skips",
          "timestamp": "2026-11-19T14:47:05-05:00",
          "tree_id": "223f7ca5005e9801cc9fcdc1768d9a4601bf1580",
          "url": "https://github.com/jonattanva/luna-form/commit/876f23e33b9139ce3c9d001a87ca9ed2e901025b"
        },
        "date": 1795117690995,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002030066400000004,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007353780799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013040412000000004,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00028126803999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00054622322,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016189084739999998,
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
          "id": "1ba5ea61d00b1402aaf4deb32e2025c53e7558b8",
          "message": "Merge pull request #186 from jonattanva/claude/heuristic-bose-fe6153\n\ntest(audit): record the feature x level matrix and unit coverage map",
          "timestamp": "2026-11-19T15:00:34-05:00",
          "tree_id": "99e51b7dbedc459b0c344b8436f10c716eddfce1",
          "url": "https://github.com/jonattanva/luna-form/commit/1ba5ea61d00b1402aaf4deb32e2025c53e7558b8"
        },
        "date": 1795118489985,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002192022800000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007686416600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00010136775999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003038529999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00042205444,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016488241279999996,
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
          "id": "fbbd01508d414cee35cfcd3cb83593c585af4866",
          "message": "Merge pull request #188 from jonattanva/claude/busy-swanson-fe8379\n\ntest(e2e): submit a day typed in the date field's own format",
          "timestamp": "2026-11-19T15:14:22-05:00",
          "tree_id": "458031cf98a61e415889312a73079676af06f538",
          "url": "https://github.com/jonattanva/luna-form/commit/fbbd01508d414cee35cfcd3cb83593c585af4866"
        },
        "date": 1795119311462,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003477781600000003,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011183521999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00015288561999999957,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00040565620000000083,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005770179800000005,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0261519172,
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
          "id": "9cfa7b186d23feb7b72a91f7636062d59940ad91",
          "message": "Merge pull request #187 from jonattanva/claude/trim-output-schemas\n\nrefactor(react): lighten the agent tools' output schemas",
          "timestamp": "2026-11-19T15:14:09-05:00",
          "tree_id": "189c4f5222daaedf4651170927e46ff22a65ff71",
          "url": "https://github.com/jonattanva/luna-form/commit/9cfa7b186d23feb7b72a91f7636062d59940ad91"
        },
        "date": 1795119311374,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002055008799999996,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007434818200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009976436000000035,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00029878325999999956,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00046616232000000024,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01619364572,
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
          "id": "4ed25fe195404a2ab3a15a6d2462f3e37c4259cd",
          "message": "Merge pull request #189 from jonattanva/claude/measure-remount\n\ntest(perf): measure a 200-field form starting over after a submit",
          "timestamp": "2026-11-19T15:19:45-05:00",
          "tree_id": "96209f4a8bc64fa8218364ea7924096c39d89eab",
          "url": "https://github.com/jonattanva/luna-form/commit/4ed25fe195404a2ab3a15a6d2462f3e37c4259cd"
        },
        "date": 1795119610814,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002189846799999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007075444800000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009165469999999971,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022680755999999973,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0003531206000000003,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.0129705332,
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
          "id": "afc8a061df65a09b88e7a71017577016cb9a7488",
          "message": "Merge pull request #190 from jonattanva/claude/youthful-carson-896dd3\n\nfix(editor): forward the form's ARIA attributes to the focused element",
          "timestamp": "2026-11-19T15:27:25-05:00",
          "tree_id": "8a7d38303d9162ec8f3f9f10fc0bee12be9ab541",
          "url": "https://github.com/jonattanva/luna-form/commit/afc8a061df65a09b88e7a71017577016cb9a7488"
        },
        "date": 1795120087777,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002445891,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008340601199999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00013105055999999992,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00031974069999999986,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004643642999999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01641344988,
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
          "id": "e8ff36c3c40dfd5f0401fa3e38fe19de89336b4c",
          "message": "Merge pull request #191 from jonattanva/claude/audit-registry-dup01-u01\n\nMark DUP-01 and U-01 fixed in the audit registry",
          "timestamp": "2026-11-19T15:43:07-05:00",
          "tree_id": "9fdb68f9d963eca9bba61cdc3a1b018a3c0fbb95",
          "url": "https://github.com/jonattanva/luna-form/commit/e8ff36c3c40dfd5f0401fa3e38fe19de89336b4c"
        },
        "date": 1795121031346,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00018557445999999972,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006775670400000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009955407999999978,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0002551773600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00039380578000000014,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.014828067340000002,
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
          "id": "19d92769d6ac55bff00fbc16b0adc7ef75e180e7",
          "message": "Merge pull request #193 from jonattanva/claude/row-scoped-rules\n\nfix(react): read a list row's requiredWhen, rules and custom in its own row",
          "timestamp": "2026-11-19T16:08:50-05:00",
          "tree_id": "42ea8d6f29624080227d05a6671ff5b96ccc992d",
          "url": "https://github.com/jonattanva/luna-form/commit/19d92769d6ac55bff00fbc16b0adc7ef75e180e7"
        },
        "date": 1795122566234,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0001692437799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0006314075600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00009166696000000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00022978902000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00034175731999999985,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.013771755739999999,
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
          "id": "ab7071c2b892a99bea2a78b8589c480fc98282d5",
          "message": "Merge pull request #192 from jonattanva/claude/gracious-greider-2f6afe\n\nPin the shared source request and fix the locked remote select",
          "timestamp": "2026-11-19T16:24:54-05:00",
          "tree_id": "25e8a281a72df90f9864d7be803297aaa0a2b00f",
          "url": "https://github.com/jonattanva/luna-form/commit/ab7071c2b892a99bea2a78b8589c480fc98282d5"
        },
        "date": 1795123538666,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00027918813999999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009612754200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00016479063999999994,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00041239582000000043,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0005293786,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.021990854900000002,
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
          "id": "0404f3afb5793e8add193e3819b1155fbcfee654",
          "message": "Merge pull request #194 from jonattanva/claude/check-row-rules\n\nfeat(core): tell a rule that names a field the form does not have",
          "timestamp": "2026-11-19T16:30:36-05:00",
          "tree_id": "816787fa759e60f1a85e5074c6bdf37864d8b84a",
          "url": "https://github.com/jonattanva/luna-form/commit/0404f3afb5793e8add193e3819b1155fbcfee654"
        },
        "date": 1795123883241,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00025504986000000034,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008359833199999997,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001063233600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003185185799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00044977499999999964,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01632228146,
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
          "id": "fea86d4f841c4df6ecb3356d3f81f97280a040a1",
          "message": "Merge pull request #195 from jonattanva/claude/plan-security-done\n\ndocs(plan): mark the two security optionals done",
          "timestamp": "2026-11-19T16:42:16-05:00",
          "tree_id": "203ed65de6186ff2167371e4a2ada92fbf811842",
          "url": "https://github.com/jonattanva/luna-form/commit/fea86d4f841c4df6ecb3356d3f81f97280a040a1"
        },
        "date": 1795124584383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0004025135999999998,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0009383826000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00014463678000000072,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003395352200000002,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004994453599999997,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01785049286,
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
          "id": "74bd258b4b880c801c0bd855e0407a5637ca3c34",
          "message": "Merge pull request #198 from jonattanva/claude/build-form-schema-lang\n\nfeat(core): validate on the server in the form's language",
          "timestamp": "2026-11-19T17:28:57-05:00",
          "tree_id": "8e0883f8348e57d35680d16e0b3c3b92eb0138a0",
          "url": "https://github.com/jonattanva/luna-form/commit/74bd258b4b880c801c0bd855e0407a5637ca3c34"
        },
        "date": 1795127376830,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0002683005600000001,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0008533749599999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00011394659999999988,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00031974308000000005,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00045541264000000014,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.016249913740000003,
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
          "id": "2a436e85b08a7b1809cdad4b52ac7774f4b7ce90",
          "message": "Merge pull request #199 from jonattanva/claude/ci-skip-docs-only\n\nci: skip checks on changes that only touch documentation",
          "timestamp": "2026-11-19T22:31:13-05:00",
          "tree_id": "9844399e9359269f5b8d911d2eff5d726ce3344c",
          "url": "https://github.com/jonattanva/luna-form/commit/2a436e85b08a7b1809cdad4b52ac7774f4b7ce90"
        },
        "date": 1795145512076,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.00020418289999999957,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0007628863799999999,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.0001015791200000001,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.00030241966000000046,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.0004510457200000002,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01614745506,
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
          "id": "276089cf9735d5f30bd629dc892720234cfbfd47",
          "message": "Merge pull request #200 from jonattanva/claude/brave-poitras-d1ad5b\n\nci: run Firefox and WebKit e2e on next start in three shards",
          "timestamp": "2026-11-19T22:33:19-05:00",
          "tree_id": "1ad2ba5d8284cb0d6ca686965940907cf3191c84",
          "url": "https://github.com/jonattanva/luna-form/commit/276089cf9735d5f30bd629dc892720234cfbfd47"
        },
        "date": 1795145627073,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "prepare: simple form (10 fields)",
            "value": 0.0003084453000000002,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields)",
            "value": 0.0011468666599999994,
            "unit": "ms"
          },
          {
            "name": "prepare: large form (50 fields) with definition",
            "value": 0.00017226701999999933,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (3 sections x 10 fields)",
            "value": 0.0003374569400000007,
            "unit": "ms"
          },
          {
            "name": "prepare: sections (5 sections x 20 fields)",
            "value": 0.00052012562,
            "unit": "ms"
          },
          {
            "name": "resolveRefs: array with $ref (20 items)",
            "value": 0.01621077446,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "98b03c564d5a7a805f1d906a0e807b6c2a1d75de",
          "message": "Merge pull request #107 from jonattanva/docs/stale-comments\n\ndocs(src): a comment points at something a reader can open",
          "timestamp": "2026-09-21T08:07:21-05:00",
          "tree_id": "d2c7b689e0972c1724904b680ec34e0cca8e42fe",
          "url": "https://github.com/jonattanva/luna-form/commit/98b03c564d5a7a805f1d906a0e807b6c2a1d75de"
        },
        "date": 1789996117777,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 235,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 169,
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
          "id": "0c28fb5a66f203bee47d762c7b5558f01d7c66df",
          "message": "Merge pull request #108 from jonattanva/docs/peer-and-entry-drift\n\ndocs: the library the pages describe is the one that ships",
          "timestamp": "2026-09-21T08:18:43-05:00",
          "tree_id": "9b3d0026cd9bbbd3a9fc430527101ec41cdbc508",
          "url": "https://github.com/jonattanva/luna-form/commit/0c28fb5a66f203bee47d762c7b5558f01d7c66df"
        },
        "date": 1789996797763,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 203,
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
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "669c265a11700fb0f955d79750d0b09f98a5e2d7",
          "message": "upgrade dependencies",
          "timestamp": "2026-09-21T08:23:11-05:00",
          "tree_id": "0e8f254d9490fa6aab1e6c85e7fbffea83834c91",
          "url": "https://github.com/jonattanva/luna-form/commit/669c265a11700fb0f955d79750d0b09f98a5e2d7"
        },
        "date": 1789997063633,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 315,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 628,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "dab47866b31fd34f5843a83ba7b7d44326b8bd2c",
          "message": "docs(interpolation): env.locale reaches labels and descriptions, not event payloads\n\n\"Locale resolution\" in format-filters.md said `config.env.locale` applies\nwherever a filter is written, a `value` payload included. It does not:\n`handleValueEvent` and `handleSourceEvent` interpolate without a locale, so\nfilters in a `value` payload and in `source.url` / `source.body` format with\nthe runtime default even when `env.locale` is set.\n\nThe page now says so, with the example run in /reactive (es-ES env, en-US\nbrowser): 1234567 through `| number` reads 1.234.567 in a description and\n1,234,567 in a value target, a source url and a POST body.\n\nTwo unit tests pin the behaviour the page describes, compared against\n`Intl.NumberFormat()` so they hold under any host locale.",
          "timestamp": "2026-10-04T21:29:56-05:00",
          "tree_id": "f563886eac52831e39d4a81d56992411752a58b1",
          "url": "https://github.com/jonattanva/luna-form/commit/dab47866b31fd34f5843a83ba7b7d44326b8bd2c"
        },
        "date": 1791167473299,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 352,
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
          "id": "1745cdda9f49e16c8340b6f1d9ea527b01d2bdbb",
          "message": "test(hidden-clear): type only once the select has finished closing\n\n\"keeps an input reverted to its static hidden that declares keepValue\"\ntimed out in Firefox in two of four full-suite runs, on the last step: the\nnote came back empty. It was never the hide. The trace shows the note's fill\nnever reached the form -- the input read \"\" straight after it, and the form\nlogged four value changes where five were due.\n\nThe editor's select plays an exit animation (`data-[state=closed]:animate-out`,\nwhich `reducedMotion` does not stop) and only then unmounts, and Radix's\nFocusScope hands focus back to the trigger a task after that. The field the\noption reveals is on screen first, so under load `toBeVisible` passed, `fill`\nfocused the note, lost focus to the closing popup, and typed into nothing. A\nprobe with the close stretched to one second lost keystrokes the same way in\nall three browsers.\n\n`choose` now waits for the listbox to go and for the trigger to hold focus,\nwhich is the last thing the close does. The helper also checks both fields hold\nwhat was typed before hiding them: a fill that never landed used to read as a\nvalue the hide lost, and let every case that expects an empty field pass on it.\n\nFirefox, 8 workers, the test repeated 40 times: 2 failures before, none after.\nFull Firefox suite at 3 workers: 591 passed.",
          "timestamp": "2026-10-04T23:12:25-05:00",
          "tree_id": "480aa8aecab644c935e6a8ff1a2a8fa3badeb7b8",
          "url": "https://github.com/jonattanva/luna-form/commit/1745cdda9f49e16c8340b6f1d9ea527b01d2bdbb"
        },
        "date": 1791173615078,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 201,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 148,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "713243cf47e2203cc9944b177a2353277e18931d",
          "message": "build(editor): the build task hashes the files next build reads\n\nThe editor's turbo.json extended the root build task and overrode only its\noutputs, so it inherited `inputs: [\"src/**\", \"scripts/**\", \"tsconfig.json\",\n\"esbuild.mjs\"]`. The editor has no src/: its code lives in app/, components/\nand lib/, beside luna.config.ts, next.config.ts and postcss.config.mjs. An edit\nto any of them left the hash unchanged, `pnpm run build` reported FULL TURBO and\nreplayed the old .next, and e2e ran against a stale editor. A change in either\npackage still invalidated it through ^build, which is why it went unnoticed.\n\nThe task now takes `$TURBO_DEFAULT$` (every tracked or unignored file, which\nleaves out .next, node_modules and the generated next-env.d.ts) plus `.env*`,\nwhich next build reads but git ignores.\n\nWith app/layout.tsx edited, before: 3 cached, FULL TURBO. After: luna-core and\nluna-react cached, the editor a cache miss; reverting the edit is a hit again.\nlint was never blind here (its transit dependency hashes every file in the\npackage), and the editor has no typescript script: next build type-checks it.",
          "timestamp": "2026-10-04T23:31:53-05:00",
          "tree_id": "b95f6a7f2849d20e08add171741815265125d58c",
          "url": "https://github.com/jonattanva/luna-form/commit/713243cf47e2203cc9944b177a2353277e18931d"
        },
        "date": 1791174785481,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 243,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 163,
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
          "id": "c1da5569b39f934039863a65db191b0c517ecd93",
          "message": "Merge pull request #109 from jonattanva/claude/input-date-range-reserved-c9c25c\n\nfeat(date): a day travels as yyyy-MM-dd, and its format only shows it",
          "timestamp": "2026-10-05T00:07:32-05:00",
          "tree_id": "a53ca21c00542d073d5193c763db926c114ea307",
          "url": "https://github.com/jonattanva/luna-form/commit/c1da5569b39f934039863a65db191b0c517ecd93"
        },
        "date": 1791176921677,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 251,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 455,
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
          "id": "9b772eb80d722e9f86b98cda0cbaa48605798ed2",
          "message": "Merge pull request #110 from jonattanva/fix/field-own-disabled\n\nfix(field): a field's own disabled locks its control on both render paths",
          "timestamp": "2026-10-05T08:57:43-05:00",
          "tree_id": "3fb7d5c3912e5b64fc68958067161800b6057d55",
          "url": "https://github.com/jonattanva/luna-form/commit/9b772eb80d722e9f86b98cda0cbaa48605798ed2"
        },
        "date": 1791208751446,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 312,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 612,
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
          "id": "43b68a0816135ba0f7c26dc163111bfdb29bf9f6",
          "message": "Merge pull request #111 from jonattanva/claude/date-limits\n\nfeat(date): a date can be held between a first and a last day",
          "timestamp": "2026-10-05T08:58:22-05:00",
          "tree_id": "1a39c11ba8a030fadfdd44142a8e49f948193ad5",
          "url": "https://github.com/jonattanva/luna-form/commit/43b68a0816135ba0f7c26dc163111bfdb29bf9f6"
        },
        "date": 1791208782802,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 308,
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
          "id": "7630798e8122974a1ff2c46ffe6c9ef5696e9b0f",
          "message": "Merge pull request #112 from jonattanva/claude/date-reserved\n\nfeat(date): days nobody can pick",
          "timestamp": "2026-10-05T09:52:06-05:00",
          "tree_id": "a4fdec00032a21a493ff208a3b7643c31eccb525",
          "url": "https://github.com/jonattanva/luna-form/commit/7630798e8122974a1ff2c46ffe6c9ef5696e9b0f"
        },
        "date": 1791212007583,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 335,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22b0fdc09c05716f2d685dcda8519c73524be18e",
          "message": "Merge pull request #113 from jonattanva/ci/e2e-parallel\n\nci: e2e in six parallel jobs with one report, on ubuntu-26.04",
          "timestamp": "2026-10-05T10:10:18-05:00",
          "tree_id": "6f22cd7d07f9e36bf64673af4295144c7dfe83ac",
          "url": "https://github.com/jonattanva/luna-form/commit/22b0fdc09c05716f2d685dcda8519c73524be18e"
        },
        "date": 1791213103317,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 251,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 499,
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
          "id": "5fc57d69f19186454fa3859063abe790e943cc6a",
          "message": "Merge pull request #114 from jonattanva/claude/date-range\n\nfeat(date): a range of days in one field",
          "timestamp": "2026-10-05T10:48:32-05:00",
          "tree_id": "bfa1a35b25ee842c15cc5eda20e6300c23811b47",
          "url": "https://github.com/jonattanva/luna-form/commit/5fc57d69f19186454fa3859063abe790e943cc6a"
        },
        "date": 1791215415384,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 322,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 607,
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
          "id": "68aa2cac8251e6b1cfb08c2c14ddd4b9846ca095",
          "message": "Merge pull request #116 from jonattanva/claude/date-docs\n\ndocs(date): how a calendar plugs into a date field",
          "timestamp": "2026-10-05T11:10:44-05:00",
          "tree_id": "0be0fa7ba22c1db537e453f237d0697b469b625c",
          "url": "https://github.com/jonattanva/luna-form/commit/68aa2cac8251e6b1cfb08c2c14ddd4b9846ca095"
        },
        "date": 1791216720700,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 236,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ddc073e0f29eb555717bc51d23ab4118e8584f5",
          "message": "Merge pull request #117 from jonattanva/claude/date-clock\n\nfeat(date): the host says what time it is",
          "timestamp": "2026-10-05T11:40:45-05:00",
          "tree_id": "26514d4a20581717f0dda6e8f67ca130b06ea41c",
          "url": "https://github.com/jonattanva/luna-form/commit/2ddc073e0f29eb555717bc51d23ab4118e8584f5"
        },
        "date": 1791218522257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 211,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 436,
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
          "id": "1364ef26c2f44487b37b1fae8e4cb9f1cd77fa79",
          "message": "Merge pull request #118 from jonattanva/claude/date-language\n\nfeat(i18n): a form speaks one language, its lang",
          "timestamp": "2026-10-05T12:02:34-05:00",
          "tree_id": "3437f801e35f10c0a14a8b883807123d21ff6cd8",
          "url": "https://github.com/jonattanva/luna-form/commit/1364ef26c2f44487b37b1fae8e4cb9f1cd77fa79"
        },
        "date": 1791219847078,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 340,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d9b334973950cd571813b9946166b0bf18d702b8",
          "message": "Merge pull request #119 from jonattanva/claude/date-strict\n\nfix(date): a rule the form cannot read takes no day",
          "timestamp": "2026-10-05T12:33:04-05:00",
          "tree_id": "54065c4acf03e53c8e57555022e984f80854500a",
          "url": "https://github.com/jonattanva/luna-form/commit/d9b334973950cd571813b9946166b0bf18d702b8"
        },
        "date": 1791221662316,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 336,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 637,
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
          "id": "4b535b42862833180a0007f81734450e39cebc60",
          "message": "Merge pull request #120 from jonattanva/fix/field-own-disabled\n\ntest(e2e): type only once a select has finished closing",
          "timestamp": "2026-10-05T13:06:16-05:00",
          "tree_id": "729afb5c508e8f8f4307dde160ddb0046706d160",
          "url": "https://github.com/jonattanva/luna-form/commit/4b535b42862833180a0007f81734450e39cebc60"
        },
        "date": 1791223638859,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 193,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 101,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "79ecc7724af7574db60e661abe8cfc7f57206efe",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-05T13:12:58-05:00",
          "tree_id": "02e2f4f9e09b0734fb6a7dba51b7973f3834bfb3",
          "url": "https://github.com/jonattanva/luna-form/commit/79ecc7724af7574db60e661abe8cfc7f57206efe"
        },
        "date": 1791224048449,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 230,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 152,
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
          "id": "e4124f583509c08044d97963a27caaa5c733a128",
          "message": "Merge pull request #121 from jonattanva/fix/length-bound-unreadable\n\nfix(schema): hold back a field whose length bound is no number",
          "timestamp": "2026-10-05T17:20:51-05:00",
          "tree_id": "d84e24291f468a2d82af0070c513e94ef5f6ffbb",
          "url": "https://github.com/jonattanva/luna-form/commit/e4124f583509c08044d97963a27caaa5c733a128"
        },
        "date": 1791238943147,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 251,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 140,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "b15e15f4a49c7c29df637fc4fc3be8abbaa83c8f",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-05T19:51:37-05:00",
          "tree_id": "3b21366fba9dfc02530c82b88825ed7a35b38442",
          "url": "https://github.com/jonattanva/luna-form/commit/b15e15f4a49c7c29df637fc4fc3be8abbaa83c8f"
        },
        "date": 1791247970489,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 269,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 170,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "045eb22286fef22f030a6aae7a3d77326ce957d4",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-06T10:45:20-05:00",
          "tree_id": "1e35390ed3b2dd4e48f9f5a3defa1e7965bc0cd4",
          "url": "https://github.com/jonattanva/luna-form/commit/045eb22286fef22f030a6aae7a3d77326ce957d4"
        },
        "date": 1791302126736,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 318,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 218,
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
          "id": "df1df49e75c7e322d459947d44e35628e3b91407",
          "message": "Merge pull request #122 from jonattanva/feat/list-fixed-and-parent-preview\n\nfeat(list): fixed lists, previews of the row above, and a badge that stays in",
          "timestamp": "2026-10-20T11:23:21-05:00",
          "tree_id": "7ea745167f4626b788e8a8e5351e71d898f97161",
          "url": "https://github.com/jonattanva/luna-form/commit/df1df49e75c7e322d459947d44e35628e3b91407"
        },
        "date": 1792513487492,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 304,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 565,
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
          "id": "fb4fc607c3f0aae99d2e43ce230e316c071685c6",
          "message": "Merge pull request #124 from jonattanva/fix/column-all-hidden\n\nfix(column): no room for a column whose fields are all hidden",
          "timestamp": "2026-10-20T15:10:29-05:00",
          "tree_id": "b72d327ac6bc0eee14fbf1f624c82995bfc737bf",
          "url": "https://github.com/jonattanva/luna-form/commit/fb4fc607c3f0aae99d2e43ce230e316c071685c6"
        },
        "date": 1792527091991,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 197,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 111,
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
          "id": "13a0a696a5797c394bcaeac7604c72ca40c37abd",
          "message": "Merge pull request #123 from jonattanva/claude/jotai-v2-v3-migration-7e91a9\n\nchore(deps): migrate jotai from v2 to v3",
          "timestamp": "2026-10-20T15:12:06-05:00",
          "tree_id": "b09bc18b463479c58c74933b56e8743eb34df5c7",
          "url": "https://github.com/jonattanva/luna-form/commit/13a0a696a5797c394bcaeac7604c72ca40c37abd"
        },
        "date": 1792527192224,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 261,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 133,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "77375f47af2f9736c3366e7ecc923e6af0346d6b",
          "message": "upgrade dependencie",
          "timestamp": "2026-10-20T15:15:15-05:00",
          "tree_id": "99d5ed3028e6df5e87b38af335a42304c7c6654a",
          "url": "https://github.com/jonattanva/luna-form/commit/77375f47af2f9736c3366e7ecc923e6af0346d6b"
        },
        "date": 1792527390829,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 308,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 529,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "c29a8cfc28287871e9725c8732b3d10653d916b2",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-20T15:35:55-05:00",
          "tree_id": "cc3682b2deac08b2645cf078d7b52eca1ae02195",
          "url": "https://github.com/jonattanva/luna-form/commit/c29a8cfc28287871e9725c8732b3d10653d916b2"
        },
        "date": 1792528639793,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 324,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 595,
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
          "id": "4641fe1e5af30fc4c54a4635d39b10871cf163ab",
          "message": "Merge pull request #125 from jonattanva/claude/state-on-host-value\n\nfix(state): re-run state rules on a value the host changes",
          "timestamp": "2026-10-25T22:29:24-05:00",
          "tree_id": "88657eb05415327302a91c6925146088341a029a",
          "url": "https://github.com/jonattanva/luna-form/commit/4641fe1e5af30fc4c54a4635d39b10871cf163ab"
        },
        "date": 1792985436110,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 210,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 164,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "958ebc8ceea549e8b5104f1512eccb37a4522251",
          "message": "format files",
          "timestamp": "2026-10-25T23:00:32-05:00",
          "tree_id": "9f279b006f9de03db6ba4bcaaaa5603f05e59a46",
          "url": "https://github.com/jonattanva/luna-form/commit/958ebc8ceea549e8b5104f1512eccb37a4522251"
        },
        "date": 1792987311110,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 307,
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
            "name": "Jonattan",
            "username": "jonattanva"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e05d0377af5a70c4fc595bba89e67cbd145ce8c5",
          "message": "Merge pull request #126 from jonattanva/claude/host-put-back-defaults\n\nfix(state): tell a host putting values back only about what it holds",
          "timestamp": "2026-10-25T23:58:07-05:00",
          "tree_id": "b8ae9183abb6eb578935129679603720fa2d2f85",
          "url": "https://github.com/jonattanva/luna-form/commit/e05d0377af5a70c4fc595bba89e67cbd145ce8c5"
        },
        "date": 1792990931021,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 232,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 156,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "2f24cee8c659d5fdeaa3e608bbe8b32c4ae17799",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-26T08:59:14-05:00",
          "tree_id": "5b2e6c435c3fae3731dcc53580203bccd2b46d7f",
          "url": "https://github.com/jonattanva/luna-form/commit/2f24cee8c659d5fdeaa3e608bbe8b32c4ae17799"
        },
        "date": 1793023245383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 195,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 153,
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
          "id": "a1ac253cdaa43846db1461e2a02f169ff2094dde",
          "message": "Merge pull request #128 from jonattanva/claude/list-toggle-row-name-65ab62\n\nfix(list): name a row's toggle after the label it shows",
          "timestamp": "2026-10-26T12:26:48-05:00",
          "tree_id": "8490bfa70f44cefb447abfe2250dbb64d35502ce",
          "url": "https://github.com/jonattanva/luna-form/commit/a1ac253cdaa43846db1461e2a02f169ff2094dde"
        },
        "date": 1793035684085,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 298,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 615,
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
          "id": "0a6eb1ab2f278c89b047d100deb3e5ddef081ec9",
          "message": "Merge pull request #129 from jonattanva/claude/list-rows-steady-5fad83\n\nperf(list): a keystroke in a row renders no row of the list",
          "timestamp": "2026-10-26T12:39:18-05:00",
          "tree_id": "ddea5ff8ac2078e453301462c7cd0439c3c378e3",
          "url": "https://github.com/jonattanva/luna-form/commit/0a6eb1ab2f278c89b047d100deb3e5ddef081ec9"
        },
        "date": 1793036423131,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 214,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 173,
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
          "id": "189adf91d31a9b4a6f24dfbb232e441c095cb9c6",
          "message": "Merge pull request #127 from jonattanva/claude/label-names-group-fields\n\nfix(label): name a group of controls after its label",
          "timestamp": "2026-10-26T13:24:17-05:00",
          "tree_id": "8ce9c32710682fdcc7f1ca4c0466ddaeedf08b03",
          "url": "https://github.com/jonattanva/luna-form/commit/189adf91d31a9b4a6f24dfbb232e441c095cb9c6"
        },
        "date": 1793039136257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 296,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 572,
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
          "id": "72da7749ca5fdc6e9047135f23e76c06f0e843e8",
          "message": "Merge pull request #131 from jonattanva/claude/fix-collapsible-preview-remove-name\n\ntest(list): name the remove button after the row label it shows",
          "timestamp": "2026-10-26T17:29:09-05:00",
          "tree_id": "880877dc0a432536ef11e00c358c98bd68da87d7",
          "url": "https://github.com/jonattanva/luna-form/commit/72da7749ca5fdc6e9047135f23e76c06f0e843e8"
        },
        "date": 1793053814982,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 193,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 151,
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
          "id": "b7ae4c526b419201cdfbc20b17d0263f280e732f",
          "message": "Merge pull request #130 from jonattanva/claude/zod-optimization-react-luna-form-4ea521\n\nperf(schema): import zod as a namespace so bundlers can shake it",
          "timestamp": "2026-10-26T19:11:50-05:00",
          "tree_id": "cb258a50e9d1688ca5ff5233d8b0b2998594a588",
          "url": "https://github.com/jonattanva/luna-form/commit/b7ae4c526b419201cdfbc20b17d0263f280e732f"
        },
        "date": 1793060353518,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 245,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 180,
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
          "id": "6c1cf502bce3772403a392c0bda2d15ec6ed849e",
          "message": "Merge pull request #133 from jonattanva/claude/stable-browser-benchmark\n\ntest(perf): measure the browser benchmark in-page, as a median",
          "timestamp": "2026-10-26T19:55:53-05:00",
          "tree_id": "9aaa6561902c2bd2537b3803ac02bfd8d2ad69b4",
          "url": "https://github.com/jonattanva/luna-form/commit/6c1cf502bce3772403a392c0bda2d15ec6ed849e"
        },
        "date": 1793062610700,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 59.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.6,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "d41ff5642acbe8b4aea37c303cf01fbe19abea59",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-26T19:56:34-05:00",
          "tree_id": "598366c3208857e6a20c5e699388d105739aa18c",
          "url": "https://github.com/jonattanva/luna-form/commit/d41ff5642acbe8b4aea37c303cf01fbe19abea59"
        },
        "date": 1793062702679,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 69.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 19.5,
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
          "id": "9ad3679fa9350e6eaf1800e0ec38c2993505a814",
          "message": "Merge pull request #134 from jonattanva/claude/built-in-select-mount-events\n\nfix(select): run a built-in selector's change events at mount",
          "timestamp": "2026-10-28T19:47:08-05:00",
          "tree_id": "58efbbc060b893a8f6b7b9c43b2e2ba71e07ace9",
          "url": "https://github.com/jonattanva/luna-form/commit/9ad3679fa9350e6eaf1800e0ec38c2993505a814"
        },
        "date": 1793234899543,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 52.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 24,
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
          "id": "db4daedce9553614a79392caf4f8b453f8f662b8",
          "message": "Merge pull request #135 from jonattanva/claude/yes-no-unanswered\n\nfix(schema): treat an unanswered Yes/No as no answer",
          "timestamp": "2026-10-30T19:47:39-05:00",
          "tree_id": "a448272a2da9383fe80c231da4b7c81a895220e9",
          "url": "https://github.com/jonattanva/luna-form/commit/db4daedce9553614a79392caf4f8b453f8f662b8"
        },
        "date": 1793407737123,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 56.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.5,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "8f5bda714428aad7dc8211ddcbd35343e6afe6cd",
          "message": "upgrade dependencies",
          "timestamp": "2026-10-30T19:57:51-05:00",
          "tree_id": "ceb5b2dcf854372bf57b622b8bc89214d84986d1",
          "url": "https://github.com/jonattanva/luna-form/commit/8f5bda714428aad7dc8211ddcbd35343e6afe6cd"
        },
        "date": 1793408328996,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 36.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 13.3,
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
          "id": "256a8a39830a2eab0bd54d1b54c3ee6a7527b878",
          "message": "Merge pull request #136 from jonattanva/claude/yes-no-default\n\nfix(schema): read an empty Yes/No as its default answer",
          "timestamp": "2026-10-31T00:27:43-05:00",
          "tree_id": "584e4f0efe62bbf1f68078fcfd67c7f7780e0c17",
          "url": "https://github.com/jonattanva/luna-form/commit/256a8a39830a2eab0bd54d1b54c3ee6a7527b878"
        },
        "date": 1793424533751,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 62.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.7,
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
          "id": "73a9c9b26cf0a7d46d9d61c4340c0a8708a10fb4",
          "message": "Merge pull request #137 from jonattanva/claude/keepvalue-nested-list-rows-b28513\n\nfix(list): give a kept nested list its rows back when it is shown again",
          "timestamp": "2026-11-03T15:14:19-05:00",
          "tree_id": "3f4e9a971702590ced306a535f512c29f276fa5c",
          "url": "https://github.com/jonattanva/luna-form/commit/73a9c9b26cf0a7d46d9d61c4340c0a8708a10fb4"
        },
        "date": 1793737014474,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 63.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 26.5,
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
          "id": "1ae9971acfc4e39193c70cb716e0b324fce6909b",
          "message": "Merge pull request #138 from jonattanva/claude/fixed-options\n\nfeat(schema): hold a field to the options its definition writes",
          "timestamp": "2026-11-03T15:18:23-05:00",
          "tree_id": "c0fd7f71fdfc2cf5abb2ba00a9c6e51a123c0686",
          "url": "https://github.com/jonattanva/luna-form/commit/1ae9971acfc4e39193c70cb716e0b324fce6909b"
        },
        "date": 1793737205452,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 77.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 21.3,
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
          "id": "6a02621cfaab50a0ca42bc4d5e25c11f2b47c46c",
          "message": "Merge pull request #140 from jonattanva/claude/max-params\n\nchore(lint): hold the library's functions to four parameters",
          "timestamp": "2026-11-03T15:18:36-05:00",
          "tree_id": "c8eee4fbf1e896a4b1bb811fd101023b470f1fcf",
          "url": "https://github.com/jonattanva/luna-form/commit/6a02621cfaab50a0ca42bc4d5e25c11f2b47c46c"
        },
        "date": 1793737280084,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 38.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.9,
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
          "id": "4b92dbdff68a5bf0650eb88530d7e2028f4a34c6",
          "message": "Merge pull request #141 from jonattanva/claude/held-options-to-main\n\nfix(form): check the value a field holds when its options cannot show it",
          "timestamp": "2026-11-03T15:37:23-05:00",
          "tree_id": "0de11970074337d8d59282c86e262626660b607b",
          "url": "https://github.com/jonattanva/luna-form/commit/4b92dbdff68a5bf0650eb88530d7e2028f4a34c6"
        },
        "date": 1793738345214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 37.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 21.1,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "44e0c0308c691005faf1f8093c75660e6034bdca",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-03T15:54:11-05:00",
          "tree_id": "a3aa20296c34ae25f673a1a2dbf0508642de953d",
          "url": "https://github.com/jonattanva/luna-form/commit/44e0c0308c691005faf1f8093c75660e6034bdca"
        },
        "date": 1793739366650,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 60,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 20.6,
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
          "id": "12ef539bfd4ec4d64e42fe9372e72d74cb130ffa",
          "message": "Merge pull request #142 from jonattanva/claude/date-fns-direct-imports\n\nperf(date): import each date-fns function and locale by its own path",
          "timestamp": "2026-11-03T22:14:42-05:00",
          "tree_id": "e362391e07e942b7b442c82771658323144adcc1",
          "url": "https://github.com/jonattanva/luna-form/commit/12ef539bfd4ec4d64e42fe9372e72d74cb130ffa"
        },
        "date": 1793762163577,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 56.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 21.3,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "843c2cb549b99dd41e4cd3eefb7949a138a4d547",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-03T22:55:06-05:00",
          "tree_id": "fc65c9323250e0162df52ff591c7817c4e128fc4",
          "url": "https://github.com/jonattanva/luna-form/commit/843c2cb549b99dd41e4cd3eefb7949a138a4d547"
        },
        "date": 1793764588472,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 67.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 20.8,
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
          "id": "77d60399a4d77564a19cc6c8b2825bda2250248f",
          "message": "Merge pull request #143 from jonattanva/claude/transform-typed-only\n\nfix(input): keep a value the form receives as it came",
          "timestamp": "2026-11-08T13:20:24-05:00",
          "tree_id": "63ceeba62485ce6564fc4244e0de302f9eeed266",
          "url": "https://github.com/jonattanva/luna-form/commit/77d60399a4d77564a19cc6c8b2825bda2250248f"
        },
        "date": 1794162097724,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 53.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 24.4,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "70499909fd71b33b0f6776ce66bdda89f0016137",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-08T13:22:33-05:00",
          "tree_id": "8db49208331bc714cbbc223aba6742b7f38efa89",
          "url": "https://github.com/jonattanva/luna-form/commit/70499909fd71b33b0f6776ce66bdda89f0016137"
        },
        "date": 1794162247579,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 55.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 20.8,
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
          "id": "e8c61ac5ecb5e60cd614e329175f22d8a9727bf7",
          "message": "Merge pull request #144 from jonattanva/claude/render-bundle-cleanup\n\nperf: cut renders and up-front JavaScript the form does not need, and remove duplicate and dead code",
          "timestamp": "2026-11-09T11:33:36-05:00",
          "tree_id": "1869a3353ff1d59cc75ccfa46f54f2b2ad6dfcf1",
          "url": "https://github.com/jonattanva/luna-form/commit/e8c61ac5ecb5e60cd614e329175f22d8a9727bf7"
        },
        "date": 1794242085151,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 65.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 19.7,
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
          "id": "6720fe726252828cf8663d7d2c0f13c0b6102b73",
          "message": "Merge pull request #145 from jonattanva/claude/transform-typed-text\n\nfix(input): rewrite only what the user types, not the text it kept",
          "timestamp": "2026-11-09T14:02:09-05:00",
          "tree_id": "d1fd4ac967e91fe92ffef37f483c66140ba497a9",
          "url": "https://github.com/jonattanva/luna-form/commit/6720fe726252828cf8663d7d2c0f13c0b6102b73"
        },
        "date": 1794250996031,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 42.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 17.2,
            "unit": "ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "committer": {
            "email": "jonattanva89@gmail.com",
            "name": "Jonattan Velasquez",
            "username": "jonattanva"
          },
          "distinct": true,
          "id": "8c184482692afe52c6a92fdb2a40a5bc1dcb9568",
          "message": "upgrade dependencies",
          "timestamp": "2026-11-09T14:10:48-05:00",
          "tree_id": "da969ae11c857eb05fb5cbb2380039b7ae0b9ee2",
          "url": "https://github.com/jonattanva/luna-form/commit/8c184482692afe52c6a92fdb2a40a5bc1dcb9568"
        },
        "date": 1794251520413,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 53.1,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.3,
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
          "id": "9debe8a58551b1350d9532472533550b74c2de79",
          "message": "Merge pull request #146 from jonattanva/claude/declared-list-rows\n\nfix(form): name the fields a list's rows leave out in withDeclaredFields",
          "timestamp": "2026-11-16T00:47:47-05:00",
          "tree_id": "3ce2f4b9da3410df83c884dbec0521182a178ae7",
          "url": "https://github.com/jonattanva/luna-form/commit/9debe8a58551b1350d9532472533550b74c2de79"
        },
        "date": 1794808136366,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 40.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.6,
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
          "id": "a9930285de1c8591d36674c0adca373c80b24431",
          "message": "Merge pull request #147 from jonattanva/claude/agent-tools\n\nAgent tools: plan, phase 0 prototype and the tool schema",
          "timestamp": "2026-11-16T16:01:49-05:00",
          "tree_id": "1a389f9b69a854f97704d7d460c63db1b7a603c5",
          "url": "https://github.com/jonattanva/luna-form/commit/a9930285de1c8591d36674c0adca373c80b24431"
        },
        "date": 1794862979202,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 59.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.7,
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
          "id": "fa696793f02a51e02e56c940a509c05d18af1ec7",
          "message": "Merge pull request #148 from jonattanva/dependabot/npm_and_yarn/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5",
          "timestamp": "2026-11-17T15:37:49-05:00",
          "tree_id": "2c0d3d744f435c26d1a39e1137a72824cad89226",
          "url": "https://github.com/jonattanva/luna-form/commit/fa696793f02a51e02e56c940a509c05d18af1ec7"
        },
        "date": 1794947934891,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 48.7,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.2,
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
          "id": "38f28fece87d4a71180df783f79d1571cceff420",
          "message": "Merge pull request #149 from jonattanva/claude/agent-apply\n\nAgent tools: write a field from outside, and the four form tools",
          "timestamp": "2026-11-17T15:39:39-05:00",
          "tree_id": "e18a97805b8bb371e3a2b727d13037fb9f451575",
          "url": "https://github.com/jonattanva/luna-form/commit/38f28fece87d4a71180df783f79d1571cceff420"
        },
        "date": 1794948049786,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 38.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.9,
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
          "id": "8861e214b10c6bf7b517570c6aefc029686208cb",
          "message": "Merge pull request #150 from jonattanva/claude/agent-host\n\nAgent tools: the agent prop, the real host, WebMCP and callTool",
          "timestamp": "2026-11-17T15:42:23-05:00",
          "tree_id": "e657a0288fcfe1c79619fb232a1f6665c6dcf86e",
          "url": "https://github.com/jonattanva/luna-form/commit/8861e214b10c6bf7b517570c6aefc029686208cb"
        },
        "date": 1794948241723,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 57.6,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 23.4,
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
          "id": "b9ac695cfede877ffa11f1387a4540d655c3d551",
          "message": "Merge pull request #151 from jonattanva/dependabot/npm_and_yarn/examples/with-next-vanilla/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5 in /examples/with-next-vanilla",
          "timestamp": "2026-11-17T15:56:35-05:00",
          "tree_id": "2e8741aad0316535f65df5795cb669f2961449f7",
          "url": "https://github.com/jonattanva/luna-form/commit/b9ac695cfede877ffa11f1387a4540d655c3d551"
        },
        "date": 1794949070628,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 33.6,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 12.6,
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
          "id": "113493c44c59138467a37ef6149d0fc285a445e2",
          "message": "Merge pull request #152 from jonattanva/dependabot/npm_and_yarn/examples/with-next-shadcn/next-16.4.5\n\nbuild(deps): bump next from 16.4.3 to 16.4.5 in /examples/with-next-shadcn",
          "timestamp": "2026-11-17T16:06:47-05:00",
          "tree_id": "e46272dcbbe145ca7818ecfdae1be93d3e6bcec4",
          "url": "https://github.com/jonattanva/luna-form/commit/113493c44c59138467a37ef6149d0fc285a445e2"
        },
        "date": 1794949676221,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 61,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 21.2,
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
          "id": "1b54bbc233c0cb0230d44afed0a79e39d982c1ef",
          "message": "Merge pull request #153 from jonattanva/claude/agent-leaf-paths\n\nAgent tools: write one field of one row by its route",
          "timestamp": "2026-11-17T16:17:33-05:00",
          "tree_id": "b3694408d0a8df6f393fe940a95a323e3614df67",
          "url": "https://github.com/jonattanva/luna-form/commit/1b54bbc233c0cb0230d44afed0a79e39d982c1ef"
        },
        "date": 1794950341042,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 45.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.5,
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
          "id": "31a896fbf1da38170f2bea7ed971ffa7f42688a8",
          "message": "Merge pull request #155 from jonattanva/claude/agent-bundle\n\nAgent tools: load build, registration and submit on demand, and three bundle budgets",
          "timestamp": "2026-11-17T20:50:20-05:00",
          "tree_id": "01bf21fcfd0ec83dfc87d5ee70cac051aa3a8f12",
          "url": "https://github.com/jonattanva/luna-form/commit/31a896fbf1da38170f2bea7ed971ffa7f42688a8"
        },
        "date": 1794966696383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 51.1,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.1,
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
          "id": "00fab0f66e87807ff1825a1f46900597c86c434c",
          "message": "Merge pull request #156 from jonattanva/claude/agent-e2e\n\nAgent tools: end-to-end coverage with real WebMCP, and the before and after measurement",
          "timestamp": "2026-11-17T21:45:28-05:00",
          "tree_id": "0c29f31308b28a5e62935178a57a0c44e12f2bcd",
          "url": "https://github.com/jonattanva/luna-form/commit/00fab0f66e87807ff1825a1f46900597c86c434c"
        },
        "date": 1794969991386,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 32.1,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 12.1,
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
          "id": "85a1a32c77b0b6cba4c61fa18c6727b557fd74dc",
          "message": "Merge pull request #157 from jonattanva/claude/replayed-change-events\n\nMove the replayed change events out of InputBase into useReplayedChangeEvents",
          "timestamp": "2026-11-17T22:00:38-05:00",
          "tree_id": "9b993382ab653386aa94712442421f6c2a01d799",
          "url": "https://github.com/jonattanva/luna-form/commit/85a1a32c77b0b6cba4c61fa18c6727b557fd74dc"
        },
        "date": 1794970908928,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 43.6,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15,
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
          "id": "542c98c4a6d484c38ec50fad31672fc1f3d5af5e",
          "message": "Merge pull request #158 from jonattanva/claude/validation-messages\n\nValidation messages in the library's words and the form's language",
          "timestamp": "2026-11-17T22:49:26-05:00",
          "tree_id": "bf1b9fa1e09e0cbf3f5406a338173c79af12f889",
          "url": "https://github.com/jonattanva/luna-form/commit/542c98c4a6d484c38ec50fad31672fc1f3d5af5e"
        },
        "date": 1794973823169,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 32.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 12.8,
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
          "id": "d43e7a7b6ebfdf529c4ea4e36f772c328e97410f",
          "message": "Merge pull request #159 from jonattanva/claude/reset-after-submit\n\nfix(react): start the form over on a store of its own after a successful submit",
          "timestamp": "2026-11-18T07:34:02-05:00",
          "tree_id": "dda39d9e7b4cfd4b9bea44f9c5aed99ffe3dee7c",
          "url": "https://github.com/jonattanva/luna-form/commit/d43e7a7b6ebfdf529c4ea4e36f772c328e97410f"
        },
        "date": 1795005668414,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 39.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 17.1,
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
          "id": "8781a671c1bc2a83d5639a29b858f358bc942e82",
          "message": "Merge pull request #160 from jonattanva/claude/close-phase-1\n\ndocs(plan): close phase 1 with the acceptance criteria met and what moves on to phases 2 and 3",
          "timestamp": "2026-11-18T07:51:50-05:00",
          "tree_id": "fa59f31bc8e92b0366c7bcb79b78736a3504100e",
          "url": "https://github.com/jonattanva/luna-form/commit/8781a671c1bc2a83d5639a29b858f358bc942e82"
        },
        "date": 1795006359105,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 31,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 11.7,
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
          "id": "c1b658d8f5e3e111908f59563ea444536d5620e0",
          "message": "Merge pull request #161 from jonattanva/claude/settle-under-load\n\nfix(react): wait for the page to draw a field a fill reveals or unlocks",
          "timestamp": "2026-11-18T10:17:58-05:00",
          "tree_id": "2fe272317a4228ddfc0cd8820e8321469a5c6f60",
          "url": "https://github.com/jonattanva/luna-form/commit/c1b658d8f5e3e111908f59563ea444536d5620e0"
        },
        "date": 1795015253363,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 41.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.7,
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
          "id": "06152c6519556fed46e979489ba3cdf1603a6325",
          "message": "Merge pull request #162 from jonattanva/claude/bundle-margin\n\nci: raise the bundle budgets to 400 kB total and 33 kB gzip on the main path, with the figures they guard",
          "timestamp": "2026-11-18T11:30:40-05:00",
          "tree_id": "c28a27ab9ce43fa079e7778485455a64c168bb7f",
          "url": "https://github.com/jonattanva/luna-form/commit/06152c6519556fed46e979489ba3cdf1603a6325"
        },
        "date": 1795019507521,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 63.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.7,
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
          "id": "58885efb7e5493accf77d6f66b63a0f850886c18",
          "message": "Merge pull request #163 from jonattanva/claude/submit-without-validation\n\nfix(react): end a submit that checks nothing the way any other ends",
          "timestamp": "2026-11-18T12:30:23-05:00",
          "tree_id": "f1323c0b2ac87b5886d47f654c43b34a865b0d8e",
          "url": "https://github.com/jonattanva/luna-form/commit/58885efb7e5493accf77d6f66b63a0f850886c18"
        },
        "date": 1795023092050,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 53.7,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.9,
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
          "id": "6e2ad9ef333415a404edb2d4d36bd6aedf80a956",
          "message": "Merge pull request #164 from jonattanva/claude/ci-playwright-image\n\nci: run the e2e tests in the Playwright image instead of installing browser packages on the runner",
          "timestamp": "2026-11-18T12:36:43-05:00",
          "tree_id": "b7df9a6263d9e01131e096d06d24995843372010",
          "url": "https://github.com/jonattanva/luna-form/commit/6e2ad9ef333415a404edb2d4d36bd6aedf80a956"
        },
        "date": 1795023454047,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 38.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.9,
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
          "id": "784af7e18bd2ca99094b837783a5cce7fc49d0e1",
          "message": "Merge pull request #166 from jonattanva/claude/five-form-measurement\n\ndocs(plan): measure a page of five forms and answer when a grouped mode pays",
          "timestamp": "2026-11-18T13:29:32-05:00",
          "tree_id": "c26b123d4cde27b19b51e29dea20843c324808cf",
          "url": "https://github.com/jonattanva/luna-form/commit/784af7e18bd2ca99094b837783a5cce7fc49d0e1"
        },
        "date": 1795026650613,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 49.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.1,
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
          "id": "8b2903c76b3627c572f8a5b54a6fef5ea492be7d",
          "message": "Merge pull request #167 from jonattanva/claude/value-change-source\n\nfeat(react): tell onValueChange who made each change",
          "timestamp": "2026-11-18T14:52:28-05:00",
          "tree_id": "edef8f01212df52521c72320ef3ec88aeb55caf3",
          "url": "https://github.com/jonattanva/luna-form/commit/8b2903c76b3627c572f8a5b54a6fef5ea492be7d"
        },
        "date": 1795031633085,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 56.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.5,
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
          "id": "f09e431a87f49bbb0d5a9311ae8dc673544e0e65",
          "message": "Merge pull request #168 from jonattanva/claude/agent-person-changed\n\nfeat(react): keep a fill from writing over what a person changed",
          "timestamp": "2026-11-18T16:37:19-05:00",
          "tree_id": "cdc15058f57c08dc8cb84b97e738ff20edeb8f20",
          "url": "https://github.com/jonattanva/luna-form/commit/f09e431a87f49bbb0d5a9311ae8dc673544e0e65"
        },
        "date": 1795038194561,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 47.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.8,
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
          "id": "e1691e4d672aaf5753757faf5faaba86bfaa0ce1",
          "message": "Merge pull request #169 from jonattanva/claude/agent-highlight\n\nfeat(react): show the person an agent at work on the form",
          "timestamp": "2026-11-18T16:45:11-05:00",
          "tree_id": "f61455b80484056f9c468c77aaa5c78aab2dd08b",
          "url": "https://github.com/jonattanva/luna-form/commit/e1691e4d672aaf5753757faf5faaba86bfaa0ce1"
        },
        "date": 1795038389819,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 56.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 19.6,
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
          "id": "f42bbb646244dab0a3b5036209ba07a38aad9c07",
          "message": "Merge pull request #170 from jonattanva/claude/remote-options\n\nfeat(react): wait for the options a field fetches, and say what brings them",
          "timestamp": "2026-11-18T18:06:53-05:00",
          "tree_id": "6c2381b7d8e1bff353fd7d32d47705142494a5e6",
          "url": "https://github.com/jonattanva/luna-form/commit/f42bbb646244dab0a3b5036209ba07a38aad9c07"
        },
        "date": 1795043301134,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 41.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.7,
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
          "id": "3e0681903bf69b2758ffb812edd4a9c3477e7051",
          "message": "Merge pull request #171 from jonattanva/claude/agent-call-log\n\nfeat(react): tell the host of every call an agent makes",
          "timestamp": "2026-11-18T19:51:27-05:00",
          "tree_id": "00c2ab1f283e668ff6f760d991db660b40dc2014",
          "url": "https://github.com/jonattanva/luna-form/commit/3e0681903bf69b2758ffb812edd4a9c3477e7051"
        },
        "date": 1795049558230,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 58.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 19.6,
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
          "id": "aaf6992e49e551a07c026b6c0d33d86b033df0d8",
          "message": "Merge pull request #172 from jonattanva/claude/authoring-tools\n\nfeat(editor): let an agent read, write and check the form the editor holds",
          "timestamp": "2026-11-19T12:33:25-05:00",
          "tree_id": "7acbac4382daf45535e373146d078367a3c8f5a9",
          "url": "https://github.com/jonattanva/luna-form/commit/aaf6992e49e551a07c026b6c0d33d86b033df0d8"
        },
        "date": 1795109676715,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 49.7,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.5,
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
          "id": "5d817faa5e000d33f2262b5b5dc0ba9406a4e1a0",
          "message": "Merge pull request #173 from jonattanva/claude/agent-fixed-list\n\nfix(react): keep the rows of a fixed list from an agent, and ask only for what the person gave",
          "timestamp": "2026-11-19T12:33:48-05:00",
          "tree_id": "1c420343342fb941199d1faba77247956bb4662b",
          "url": "https://github.com/jonattanva/luna-form/commit/5d817faa5e000d33f2262b5b5dc0ba9406a4e1a0"
        },
        "date": 1795109708144,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 67,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.3,
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
          "id": "1df3fd47b44456d9bec1da51f129e978bc47d667",
          "message": "Merge pull request #174 from jonattanva/claude/editor-remote-patterns\n\nfix(core): read a source's URL for remotePatterns the way the fetcher calls it",
          "timestamp": "2026-11-19T12:54:20-05:00",
          "tree_id": "55bd70e726e2f628f20b21885d187beee8c5146a",
          "url": "https://github.com/jonattanva/luna-form/commit/1df3fd47b44456d9bec1da51f129e978bc47d667"
        },
        "date": 1795110937308,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 57.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.4,
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
          "id": "43dc86aa90f7dd2c31639953da55ef4923872131",
          "message": "Merge pull request #176 from jonattanva/claude/luna-form-command-restructure-8c9f7f\n\nAdd /audit and /test-audit commands with an in-repo findings registry, and their first runs",
          "timestamp": "2026-11-19T13:10:40-05:00",
          "tree_id": "995a959b0b75822828fa22b52c1923eda27f33f2",
          "url": "https://github.com/jonattanva/luna-form/commit/43dc86aa90f7dd2c31639953da55ef4923872131"
        },
        "date": 1795111902818,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 41.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.5,
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
          "id": "3496fc93adfbff5ddb9b0cb13fc592ce26a4bb01",
          "message": "Merge pull request #177 from jonattanva/claude/s-02-unused-exports\n\nStop exporting what nothing imports",
          "timestamp": "2026-11-19T13:20:20-05:00",
          "tree_id": "33aecb37d124cc83e38e434ec9bdd9b2a976f118",
          "url": "https://github.com/jonattanva/luna-form/commit/3496fc93adfbff5ddb9b0cb13fc592ce26a4bb01"
        },
        "date": 1795112488408,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 57.6,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16,
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
          "id": "057920a52aba4069b5a67817f0f78a6560d60b0d",
          "message": "Merge pull request #175 from jonattanva/claude/schema-text-length\n\nfix(core): keep long host text out of what an agent reads first",
          "timestamp": "2026-11-19T13:31:18-05:00",
          "tree_id": "b725ecd406be5d8003fe87995298e64f8ca2f4b8",
          "url": "https://github.com/jonattanva/luna-form/commit/057920a52aba4069b5a67817f0f78a6560d60b0d"
        },
        "date": 1795113396477,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 38.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.8,
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
          "id": "8fa8adf4ce6e2924e60b3bfe3ccd848717dffd21",
          "message": "Merge pull request #179 from jonattanva/claude/remove-preserve-values\n\nrefactor(react): remove the preserveValues option",
          "timestamp": "2026-11-19T13:39:22-05:00",
          "tree_id": "a8eb48c515a0930ca7e75d893f68e194c2504c36",
          "url": "https://github.com/jonattanva/luna-form/commit/8fa8adf4ce6e2924e60b3bfe3ccd848717dffd21"
        },
        "date": 1795113650479,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 39.1,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.1,
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
          "id": "c4db2d423db0013500e9d50fec2579034ef905f4",
          "message": "Merge pull request #178 from jonattanva/claude/bug-02-resolve-target\n\nfix(core): read a row-relative target's list name as text, not as a pattern",
          "timestamp": "2026-11-19T13:46:30-05:00",
          "tree_id": "03c0d8ce23b84cb372c7199c1b794f967e74cb28",
          "url": "https://github.com/jonattanva/luna-form/commit/c4db2d423db0013500e9d50fec2579034ef905f4"
        },
        "date": 1795114059282,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 40.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 17,
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
          "id": "8df8ac5250fcd33134f76ed5b2ef93d06c296651",
          "message": "Merge pull request #180 from jonattanva/claude/brave-boyd-aee2b6\n\nfix(react): move the focus to the first field with an error after a failed submit",
          "timestamp": "2026-11-19T13:47:07-05:00",
          "tree_id": "3f193e7ca5fa79eca88a08a65ee2c6f1ca2a6ae6",
          "url": "https://github.com/jonattanva/luna-form/commit/8df8ac5250fcd33134f76ed5b2ef93d06c296651"
        },
        "date": 1795114103712,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 59.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 22.1,
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
          "id": "b2a53eeb9576a0e978071709b7e3092961e42c72",
          "message": "Merge pull request #181 from jonattanva/claude/audit-registry-fixes\n\nRecord the fixes for S-02, BUG-02 and U-02 in the audit registry",
          "timestamp": "2026-11-19T13:58:15-05:00",
          "tree_id": "841cdc1eaa2af2fcbd943d06b58df40fe5ba58d3",
          "url": "https://github.com/jonattanva/luna-form/commit/b2a53eeb9576a0e978071709b7e3092961e42c72"
        },
        "date": 1795114764642,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 52.3,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.6,
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
          "id": "5b2663075d393e62a2cb79e53651aef37e29b045",
          "message": "Merge pull request #183 from jonattanva/claude/nice-gould-5736e0\n\nchore: add the Playwright MCP server and playwright-cli skill for agents",
          "timestamp": "2026-11-19T14:20:48-05:00",
          "tree_id": "888c6be825314f544c27c6dac88adc2973b3a315",
          "url": "https://github.com/jonattanva/luna-form/commit/5b2663075d393e62a2cb79e53651aef37e29b045"
        },
        "date": 1795116158878,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 33.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.7,
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
          "id": "65c4dd493b3831aa5dbdd68b1034b2a6c4dcd997",
          "message": "Merge pull request #184 from jonattanva/claude/audit-registry-merged\n\nMark BUG-02 and U-02 fixed in the audit registry",
          "timestamp": "2026-11-19T14:46:38-05:00",
          "tree_id": "ed43682626e14dc63dda221cab582c19021e56f5",
          "url": "https://github.com/jonattanva/luna-form/commit/65c4dd493b3831aa5dbdd68b1034b2a6c4dcd997"
        },
        "date": 1795117680284,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 40.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 18.4,
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
          "id": "876f23e33b9139ce3c9d001a87ca9ed2e901025b",
          "message": "Merge pull request #185 from jonattanva/claude/notes-unchecked-submit\n\nfix(core): leave out of the agent schema the rules a submit that checks nothing skips",
          "timestamp": "2026-11-19T14:47:05-05:00",
          "tree_id": "223f7ca5005e9801cc9fcdc1768d9a4601bf1580",
          "url": "https://github.com/jonattanva/luna-form/commit/876f23e33b9139ce3c9d001a87ca9ed2e901025b"
        },
        "date": 1795117750455,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 34.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 17.1,
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
          "id": "1ba5ea61d00b1402aaf4deb32e2025c53e7558b8",
          "message": "Merge pull request #186 from jonattanva/claude/heuristic-bose-fe6153\n\ntest(audit): record the feature x level matrix and unit coverage map",
          "timestamp": "2026-11-19T15:00:34-05:00",
          "tree_id": "99e51b7dbedc459b0c344b8436f10c716eddfce1",
          "url": "https://github.com/jonattanva/luna-form/commit/1ba5ea61d00b1402aaf4deb32e2025c53e7558b8"
        },
        "date": 1795118778005,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 35.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16.2,
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
          "id": "9cfa7b186d23feb7b72a91f7636062d59940ad91",
          "message": "Merge pull request #187 from jonattanva/claude/trim-output-schemas\n\nrefactor(react): lighten the agent tools' output schemas",
          "timestamp": "2026-11-19T15:14:09-05:00",
          "tree_id": "189c4f5222daaedf4651170927e46ff22a65ff71",
          "url": "https://github.com/jonattanva/luna-form/commit/9cfa7b186d23feb7b72a91f7636062d59940ad91"
        },
        "date": 1795119372472,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 37.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 17.3,
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
          "id": "4ed25fe195404a2ab3a15a6d2462f3e37c4259cd",
          "message": "Merge pull request #189 from jonattanva/claude/measure-remount\n\ntest(perf): measure a 200-field form starting over after a submit",
          "timestamp": "2026-11-19T15:19:45-05:00",
          "tree_id": "96209f4a8bc64fa8218364ea7924096c39d89eab",
          "url": "https://github.com/jonattanva/luna-form/commit/4ed25fe195404a2ab3a15a6d2462f3e37c4259cd"
        },
        "date": 1795119651077,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 38.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 13.6,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 35.4,
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
          "id": "afc8a061df65a09b88e7a71017577016cb9a7488",
          "message": "Merge pull request #190 from jonattanva/claude/youthful-carson-896dd3\n\nfix(editor): forward the form's ARIA attributes to the focused element",
          "timestamp": "2026-11-19T15:27:25-05:00",
          "tree_id": "8a7d38303d9162ec8f3f9f10fc0bee12be9ab541",
          "url": "https://github.com/jonattanva/luna-form/commit/afc8a061df65a09b88e7a71017577016cb9a7488"
        },
        "date": 1795120129659,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 41.7,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.2,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 44.2,
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
          "id": "e8ff36c3c40dfd5f0401fa3e38fe19de89336b4c",
          "message": "Merge pull request #191 from jonattanva/claude/audit-registry-dup01-u01\n\nMark DUP-01 and U-01 fixed in the audit registry",
          "timestamp": "2026-11-19T15:43:07-05:00",
          "tree_id": "9fdb68f9d963eca9bba61cdc3a1b018a3c0fbb95",
          "url": "https://github.com/jonattanva/luna-form/commit/e8ff36c3c40dfd5f0401fa3e38fe19de89336b4c"
        },
        "date": 1795121064312,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 41.5,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 14.6,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 40.8,
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
          "id": "19d92769d6ac55bff00fbc16b0adc7ef75e180e7",
          "message": "Merge pull request #193 from jonattanva/claude/row-scoped-rules\n\nfix(react): read a list row's requiredWhen, rules and custom in its own row",
          "timestamp": "2026-11-19T16:08:50-05:00",
          "tree_id": "42ea8d6f29624080227d05a6671ff5b96ccc992d",
          "url": "https://github.com/jonattanva/luna-form/commit/19d92769d6ac55bff00fbc16b0adc7ef75e180e7"
        },
        "date": 1795122602313,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 37.8,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 13.7,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 39.8,
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
          "id": "ab7071c2b892a99bea2a78b8589c480fc98282d5",
          "message": "Merge pull request #192 from jonattanva/claude/gracious-greider-2f6afe\n\nPin the shared source request and fix the locked remote select",
          "timestamp": "2026-11-19T16:24:54-05:00",
          "tree_id": "25e8a281a72df90f9864d7be803297aaa0a2b00f",
          "url": "https://github.com/jonattanva/luna-form/commit/ab7071c2b892a99bea2a78b8589c480fc98282d5"
        },
        "date": 1795123581094,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 52.9,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 23.3,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 50.7,
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
          "id": "0404f3afb5793e8add193e3819b1155fbcfee654",
          "message": "Merge pull request #194 from jonattanva/claude/check-row-rules\n\nfeat(core): tell a rule that names a field the form does not have",
          "timestamp": "2026-11-19T16:30:36-05:00",
          "tree_id": "816787fa759e60f1a85e5074c6bdf37864d8b84a",
          "url": "https://github.com/jonattanva/luna-form/commit/0404f3afb5793e8add193e3819b1155fbcfee654"
        },
        "date": 1795123921138,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 60.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.3,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 44.9,
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
          "id": "fea86d4f841c4df6ecb3356d3f81f97280a040a1",
          "message": "Merge pull request #195 from jonattanva/claude/plan-security-done\n\ndocs(plan): mark the two security optionals done",
          "timestamp": "2026-11-19T16:42:16-05:00",
          "tree_id": "203ed65de6186ff2167371e4a2ada92fbf811842",
          "url": "https://github.com/jonattanva/luna-form/commit/fea86d4f841c4df6ecb3356d3f81f97280a040a1"
        },
        "date": 1795124623509,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 42.4,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 16,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 45.3,
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
          "id": "74bd258b4b880c801c0bd855e0407a5637ca3c34",
          "message": "Merge pull request #198 from jonattanva/claude/build-form-schema-lang\n\nfeat(core): validate on the server in the form's language",
          "timestamp": "2026-11-19T17:28:57-05:00",
          "tree_id": "8e0883f8348e57d35680d16e0b3c3b92eb0138a0",
          "url": "https://github.com/jonattanva/luna-form/commit/74bd258b4b880c801c0bd855e0407a5637ca3c34"
        },
        "date": 1795127408070,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "browser: form load time (50 fields)",
            "value": 46.2,
            "unit": "ms"
          },
          {
            "name": "browser: interaction time (10 fields)",
            "value": 15.4,
            "unit": "ms"
          },
          {
            "name": "browser: start over after a submit (200 fields)",
            "value": 50.1,
            "unit": "ms"
          }
        ]
      }
    ]
  }
}