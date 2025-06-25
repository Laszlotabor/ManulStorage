import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';








@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = false;

  
    constructor() {
      this.auth.user$.subscribe((user) => {
        console.log('Navbar user:', user);
        this.isLoggedIn = !!user;
      
      });
    }
    
  

  logout() {
    this.auth.logout().then(() => this.router.navigate(['/login']));
  }
}
