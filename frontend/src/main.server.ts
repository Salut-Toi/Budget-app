import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config.server';

// Ne pas typer BootstrapContext (non exporté publiquement)
export default function bootstrap(context: unknown) {
  return bootstrapApplication(AppComponent, appConfig, context as any);
}
