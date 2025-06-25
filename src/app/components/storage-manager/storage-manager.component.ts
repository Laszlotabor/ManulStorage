import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../services/base-service.service';
import { StorageUnit } from '../../models/storage-unit.model';

import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-storage-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './storage-manager.component.html',
  styleUrls: ['./storage-manager.component.scss'],
})
export class StorageManagerComponent implements OnInit {
  storageName: string = '';
  storages$: Observable<StorageUnit[]> = this.baseService.getStorages();

  constructor(private baseService: BaseService) {}

  ngOnInit(): void {}

  addStorage() {
    if (!this.storageName.trim()) return;

    this.baseService
      .createStorage({
        name: this.storageName,
        items: [],
        orders: [],
      
      })
      .then(() => (this.storageName = ''));
  }
}
