import { expect, test } from '@playwright/test'
import { inject } from './support/inject'

test.describe('Event change features', { tag: ['@e2e'] }, () => {
  test('should respect onlyIfTargetEmpty in value action', async ({ page }) => {
    await inject(
      page,
      `{
        "sections": [
          {
            "fields": [
              {
                "label": "Source Field",
                "name": "source",
                "type": "input",
                "event": {
                  "change": [
                    {
                      "action": "value",
                      "onlyIfTargetEmpty": true,
                      "value": {
                        "target": "{value}"
                      }
                    }
                  ]
                }
              },
              {
                "label": "Target Field",
                "name": "target",
                "type": "input"
              }
            ]
          }
        ]
      }`
    )
    await page.goto('')

    const sourceInput = page.getByLabel('Source Field')
    const targetInput = page.getByLabel('Target Field')

    // 1. Initial change should populate target if empty
    await sourceInput.fill('Value 1')
    await expect(targetInput).toHaveValue('Value 1')

    // 2. Clear target manually
    await targetInput.fill('')
    
    // 3. Change source again, target should be populated because it's empty
    await sourceInput.fill('Value 2')
    await expect(targetInput).toHaveValue('Value 2')

    // 4. Fill target manually with something else
    await targetInput.fill('Manual Value')
    
    // 5. Change source again, target should NOT be overwritten
    await sourceInput.fill('Value 3')
    await expect(targetInput).toHaveValue('Manual Value')
  })
})
