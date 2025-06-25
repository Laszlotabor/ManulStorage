import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageUnit } from '../models/storage-unit.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth-service.service';

@Injectable({ providedIn: 'root' })
export class BaseService {
  private basePath = 'storages';

  constructor(
    private db: AngularFireDatabase, // ✅ compat DB
    private auth: AuthService
  ) {}

  // ✅ Create a new storage
  createStorage(storage: Omit<StorageUnit, 'id' | 'ownerId'>): Promise<void> {
    const newRef = this.db.list(this.basePath).push({});
    const id = newRef.key!;
    const ownerId = this.auth.currentUserId;

    return newRef.set({
      id,
      ownerId,
      ...storage,
    });
  }

  // ✅ Get all storages for current user
  getStorages(): Observable<StorageUnit[]> {
    return this.db
      .list<StorageUnit>(this.basePath)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          const uid = this.auth.currentUserId;
          return changes
            .map((c) => ({
              id: c.payload.key!,
              ...(c.payload.val() as Omit<StorageUnit, 'id'>),
            }))
            .filter((storage) => storage.ownerId === uid);
        })
      );
  }

  // ✅ Get single storage by ID
  getStorageById(id: string): Observable<StorageUnit | null> {
    return this.db.object<StorageUnit>(`${this.basePath}/${id}`).valueChanges();
  }

  // ✅ Update storage
  updateStorage(id: string, data: Partial<StorageUnit>): Promise<void> {
    return this.db.object(`${this.basePath}/${id}`).update(data);
  }

  // ✅ Delete storage
  deleteStorage(id: string): Promise<void> {
    return this.db.object(`${this.basePath}/${id}`).remove();
  }
}
