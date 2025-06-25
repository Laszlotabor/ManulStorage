import { StorageItem } from './storage-item.model';

export interface StorageUnit {
  id: string;
  name: string;
  items: StorageItem[];
  orders: StorageItem[];
  ownerId: string; // ✅ Add this
}
  
