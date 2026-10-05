import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'test/browser',use:{baseURL:'http://127.0.0.1:6714',headless:true},webServer:{command:'npm run demo',url:'http://127.0.0.1:6714',reuseExistingServer:!process.env.CI}});
