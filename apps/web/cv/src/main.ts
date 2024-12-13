import { bootstrapApplication } from '@angular/platform-browser';
import { CvApp } from './app/cv-app';
import { cvAppConfig } from './app/cv-app.config';

try {
  await bootstrapApplication(CvApp, cvAppConfig);
} catch (error) {
  console.error(error);
}
