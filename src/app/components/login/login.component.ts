import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth
      .signInWithEmail(this.email, this.password)
      .then(() => this.router.navigate(['/home']))
      .catch((err) => alert(err.message || 'Login failed.'));
  }

  loginWithGoogle() {
    this.auth
      .signInWithGoogle()
      .then(() => this.router.navigate(['/home']))
      .catch((err) => alert(err.message || 'Google sign-in failed.'));
  }
}
