import { bootstrapApplication } from '@angular/platform-browser';
import { CvApp } from './app/cv-app';
import { CV_APP_CONFIG } from './app/cv-app.config';

try {
  await bootstrapApplication(CvApp, CV_APP_CONFIG);
} catch (error) {
  console.error(error);
}
