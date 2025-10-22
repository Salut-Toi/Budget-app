import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch /* , withInterceptorsFromDi */ } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // 🔑 Active HttpClient (pas besoin d'importer HttpClientModule en standalone)
    provideHttpClient(
      withFetch(),              // utilise fetch (plus léger que XHR)
      // withInterceptorsFromDi() // dé-commente si tu ajoutes des interceptors (auth, etc.)
    ),
  ],
};
