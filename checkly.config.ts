import { defineConfig } from 'checkly';
import { AlertEscalationBuilder, RetryStrategyBuilder } from 'checkly/constructs';

/**
 * See https://www.checklyhq.com/docs/cli/project-structure/
 */
const config = defineConfig({
  /* A human friendly name for your project */
  projectName: 'Watts Example',
  logicalId: 'watts-example-repo',
  checks: {
    /* A default for how often your Check should run in minutes */
    frequency: 10,
    /* Checkly data centers to run your Checks as monitors */
    locations: ['us-east-1', 'us-west-1'],
    /* An optional array of tags to organize your Checks */
    tags: ['mac'],
    /** The Checkly Runtime identifier, determining npm packages and the Node.js version available at runtime.
     * See https://www.checklyhq.com/docs/cli/npm-packages/
     */
    runtimeId: '2024.02',
    /* Failed check runs will be retried before triggering alerts */
    retryStrategy: RetryStrategyBuilder.fixedStrategy({
      baseBackoffSeconds: 60,
      maxRetries: 4,
      sameRegion: true,
    }),
    /* All checks will have this alert escalation policy defined */
    alertEscalationPolicy: AlertEscalationBuilder.runBasedEscalation(1),
    /* A glob pattern that matches the Checks inside your repo, see https://www.checklyhq.com/docs/cli/using-check-test-match/ */
    checkMatch: '**/__checks__/**/*.check.ts',
    /* Global configuration option for Playwright-powered checks. See https://docs/browser-checks/playwright-test/#global-configuration */
    playwrightConfig: {
      timeout: 30000,
      use: {
        baseURL: 'https://www.danube-web.shop',
        viewport: { width: 1280, height: 720 },
      },
    },
    browserChecks: {
      /* A glob pattern matches any Playwright .spec.ts files and automagically creates a Browser Check. This way, you
       * can just write native Playwright code. See https://www.checklyhq.com/docs/cli/using-check-test-match/
       * */
      testMatch: '**/tests/e2e/*.spec.ts',
    },
  },
  cli: {
    /* The default datacenter location to use when running npx checkly test */
    runLocation: 'us-east-1',
    /* An array of default reporters to use when a reporter is not specified with the "--reporter" flag */
    reporters: ['list'],
    /* How many times to retry a failing test run when running `npx checkly test` or `npx checkly trigger` (max. 3) */
    retries: 0,
  },
});

export default config;
