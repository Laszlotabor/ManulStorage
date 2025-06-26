import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseService } from '../../services/base-service.service';
import { StorageUnit } from '../../models/storage-unit.model';
import { StorageItem } from '../../models/storage-item.model';
import { FormsModule } from '@angular/forms';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-storage-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './storage-detail.component.html',
  styleUrls: ['./storage-detail.component.scss'],
})
export class StorageDetailComponent implements OnInit {
  storageId: string = '';
  storage$: Observable<StorageUnit | null> | null = null;
  storageSnapshot: StorageUnit | null = null;

  newItem: Partial<StorageItem> = {
    name: '',
    quantity: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private baseService: BaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storage$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (id) {
          this.storageId = id;
          return this.baseService.getStorageById(id);
        }
        return [];
      }),
      tap((storage) => {
        this.storageSnapshot = storage;
      })
    );
  }

  addItem(storage: StorageUnit) {
    if (!this.newItem.name || !this.newItem.quantity) return;

    const updatedItems: StorageItem[] = [
      ...(storage.items || []),
      {
        id: crypto.randomUUID(),
        name: this.newItem.name,
        quantity: this.newItem.quantity!,
      },
    ];

    this.baseService
      .updateStorage(storage.id, { items: updatedItems })
      .then(() => {
        this.newItem = { name: '', quantity: 0 };
      });
  }

  promptOrder(item: StorageItem) {
    const qtyStr = prompt(`How many "${item.name}" to add to order?`);
    const qty = Number(qtyStr);

    if (!qty || qty <= 0) {
      alert('Invalid quantity');
      return;
    }

    if (qty > item.quantity) {
      alert(`You only have ${item.quantity} of "${item.name}" in stock.`);
      return;
    }

    const orders = [...(this.storageSnapshot?.orders || [])];
    const existingOrder = orders.find((o) => o.id === item.id);

    if (existingOrder) {
      existingOrder.quantity += qty;
    } else {
      orders.push({
        id: item.id,
        name: item.name,
        quantity: qty,
      });
    }

    // Subtract from items
    const updatedItems = this.storageSnapshot!.items.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity - qty } : i
    );

    this.baseService.updateStorage(this.storageSnapshot!.id, {
      items: updatedItems,
      orders,
    });
  }

  editOrder(order: StorageItem) {
    const newQtyStr = prompt(
      `Update quantity for "${order.name}":`,
      order.quantity.toString()
    );
    const newQty = Number(newQtyStr);

    if (!newQty || newQty <= 0) {
      alert('Invalid quantity');
      return;
    }

    const updatedItems = this.storageSnapshot!.items.map((item) =>
      item.id === order.id
        ? { ...item, quantity: item.quantity + order.quantity }
        : item
    );

    const itemToUpdate = updatedItems.find((i) => i.id === order.id);
    if (!itemToUpdate || itemToUpdate.quantity < newQty) {
      alert(`Not enough stock. You only have ${itemToUpdate?.quantity ?? 0}`);
      return;
    }

    const finalItems = updatedItems.map((item) =>
      item.id === order.id
        ? { ...item, quantity: item.quantity - newQty }
        : item
    );

    const updatedOrders = this.storageSnapshot!.orders.map((o) =>
      o.id === order.id ? { ...o, quantity: newQty } : o
    );

    this.baseService.updateStorage(this.storageSnapshot!.id, {
      items: finalItems,
      orders: updatedOrders,
    });
  }

  deleteOrder(order: StorageItem) {
    const orders = [...(this.storageSnapshot?.orders || [])];
    const updatedOrders: StorageItem[] = [];

    let removed = false;

    for (const o of orders) {
      if (!removed && o.id === order.id && o.quantity === order.quantity) {
        removed = true; // skip this one
      } else {
        updatedOrders.push(o);
      }
    }

    // Restore to items
    const updatedItems = this.storageSnapshot!.items.map((item) =>
      item.id === order.id
        ? { ...item, quantity: item.quantity + order.quantity }
        : item
    );

    this.baseService.updateStorage(this.storageSnapshot!.id, {
      items: updatedItems,
      orders: updatedOrders,
    });
  }

  deleteStorage() {
    const confirm1 = confirm(
      'Are you sure you want to delete this storage? This action cannot be undone.'
    );

    if (!confirm1) return;

    const confirm2 = prompt('Type DELETE to confirm:');

    if (confirm2 !== 'DELETE') {
      alert('Storage not deleted. Confirmation failed.');
      return;
    }

    this.baseService.deleteStorage(this.storageSnapshot!.id).then(() => {
      alert('Storage deleted.');
      this.router.navigate(['/storages']);
    });
  }
  topUpStock(item: StorageItem) {
    const qtyStr = prompt(`How much more to add to "${item.name}"?`);
    const qty = Number(qtyStr);

    if (!qty || qty <= 0) {
      alert('Invalid quantity');
      return;
    }

    const updatedItems = this.storageSnapshot!.items.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
    );

    this.baseService.updateStorage(this.storageSnapshot!.id, {
      items: updatedItems,
    });
  }
  deleteItem(itemToDelete: StorageItem) {
    if (!confirm(`Are you sure you want to delete "${itemToDelete.name}"?`))
      return;

    const updatedItems = this.storageSnapshot!.items.filter(
      (item) => item.id !== itemToDelete.id
    );
    const updatedOrders = this.storageSnapshot!.orders.filter(
      (order) => order.id !== itemToDelete.id
    );

    this.baseService.updateStorage(this.storageSnapshot!.id, {
      items: updatedItems,
      orders: updatedOrders,
    });
  }
}
