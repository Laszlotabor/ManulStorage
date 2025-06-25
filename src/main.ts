import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AngularFireModule } from '@angular/fire/compat'; // ✅ Add this
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { importProvidersFrom } from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig), // ✅ This fixes the DI error
      AngularFireDatabaseModule
    ),
    provideRouter(routes),
  ],
});
