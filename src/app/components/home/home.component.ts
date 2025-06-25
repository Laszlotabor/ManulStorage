import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service'; // adjust path if needed

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private auth: AuthService, private router: Router) {}

  navigateToStart() {
    if (this.auth.currentUserId) {
      this.router.navigate(['/storages']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
