import { bootstrapApplication } from '@angular/platform-browser';
import { CvApp } from './app/app';
import { CV_APP_CONFIG } from './app/config';

try {
  await bootstrapApplication(CvApp, CV_APP_CONFIG);
} catch (error) {
  console.error(error);
}
