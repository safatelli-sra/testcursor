import { Injectable, computed, signal } from '@angular/core';

export interface Permission {
  id: string; // e.g., 'users.view'
  label: string; // e.g., 'View users'
}

export interface Role {
  id: number;
  name: string;
  permissionIds: string[];
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  roleId: number | null;
  extraPermissionIds: string[]; // optional, per-user overrides
}

export interface Store {
  id: number;
  name: string;
  brand: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TourMission {
  id: number;
  collaboratorName: string; // nom du collaborateur
  storeId: number; // magasin assigné
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  missionType: string; // type de mission
  department: string; // rayon concerné
}

@Injectable({ providedIn: 'root' })
export class StaticDataService {
  // Permissions catalog
  readonly permissions = signal<Permission[]>([
    { id: 'users.view', label: 'Voir les utilisateurs' },
    { id: 'users.add', label: 'Ajouter des utilisateurs' },
    { id: 'users.edit', label: 'Modifier des utilisateurs' },
    { id: 'users.delete', label: 'Supprimer des utilisateurs' },
    { id: 'roles.view', label: 'Voir les rôles' },
    { id: 'roles.manage', label: 'Gérer les rôles' },
    { id: 'stores.view', label: 'Voir les magasins' },
    { id: 'stores.manage', label: 'Gérer les magasins' },
    { id: 'tours.view', label: 'Voir les tournées' },
    { id: 'tours.manage', label: 'Gérer les tournées' },
  ]);

  // Roles and users
  readonly roles = signal<Role[]>([
    {
      id: 1,
      name: 'Administrateur',
      permissionIds: this.permissions().map((p) => p.id),
    },
    {
      id: 2,
      name: 'Manager',
      permissionIds: [
        'users.view',
        'roles.view',
        'stores.view',
        'stores.manage',
        'tours.view',
        'tours.manage',
      ],
    },
    {
      id: 3,
      name: 'Visiteur',
      permissionIds: ['users.view', 'roles.view', 'stores.view', 'tours.view'],
    },
  ]);

  private nextRoleId = 4;

  readonly users = signal<User[]>([
    {
      id: 1,
      fullName: 'Alice Martin',
      email: 'alice.martin@example.com',
      roleId: 2,
      extraPermissionIds: [],
    },
    {
      id: 2,
      fullName: 'Bob Dupont',
      email: 'bob.dupont@example.com',
      roleId: 3,
      extraPermissionIds: [],
    },
  ]);

  private nextUserId = 3;

  // Competitor stores
  readonly stores = signal<Store[]>([
    {
      id: 1,
      name: 'Magasin Alpha',
      brand: 'Concurrence A',
      latitude: 48.8566,
      longitude: 2.3522,
      address: 'Paris, France',
    },
    {
      id: 2,
      name: 'Magasin Beta',
      brand: 'Concurrence B',
      latitude: 45.764,
      longitude: 4.8357,
      address: 'Lyon, France',
    },
  ]);

  private nextStoreId = 3;

  // Tours / Missions
  readonly tours = signal<TourMission[]>([
    {
      id: 1,
      collaboratorName: 'Alice Martin',
      storeId: 1,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      missionType: 'Audit',
      department: 'Électronique',
    },
  ]);

  private nextTourId = 2;

  // Derived lookups
  readonly roleIdToRole = computed(() => {
    const map = new Map<number, Role>();
    for (const role of this.roles()) map.set(role.id, role);
    return map;
  });

  // Users CRUD
  addUser(user: Omit<User, 'id'>) {
    const newUser: User = { ...user, id: this.nextUserId++ };
    this.users.update((list) => [...list, newUser]);
  }

  updateUser(id: number, updates: Partial<Omit<User, 'id'>>) {
    this.users.update((list) =>
      list.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }

  deleteUser(id: number) {
    this.users.update((list) => list.filter((u) => u.id !== id));
  }

  // Roles CRUD
  addRole(role: Omit<Role, 'id'>) {
    const newRole: Role = { ...role, id: this.nextRoleId++ };
    this.roles.update((list) => [...list, newRole]);
  }

  updateRole(id: number, updates: Partial<Omit<Role, 'id'>>) {
    this.roles.update((list) =>
      list.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }

  deleteRole(id: number) {
    // Remove role from users that reference it
    this.users.update((list) =>
      list.map((u) => (u.roleId === id ? { ...u, roleId: null } : u))
    );
    this.roles.update((list) => list.filter((r) => r.id !== id));
  }

  // Stores CRUD
  addStore(store: Omit<Store, 'id'>) {
    const newStore: Store = { ...store, id: this.nextStoreId++ };
    this.stores.update((list) => [...list, newStore]);
  }

  updateStore(id: number, updates: Partial<Omit<Store, 'id'>>) {
    this.stores.update((list) =>
      list.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  deleteStore(id: number) {
    // Also unassign from tours
    this.tours.update((list) => list.filter((t) => t.storeId !== id));
    this.stores.update((list) => list.filter((s) => s.id !== id));
  }

  // Tours CRUD
  addTour(tour: Omit<TourMission, 'id'>) {
    const newTour: TourMission = { ...tour, id: this.nextTourId++ };
    this.tours.update((list) => [...list, newTour]);
  }

  updateTour(id: number, updates: Partial<Omit<TourMission, 'id'>>) {
    this.tours.update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  deleteTour(id: number) {
    this.tours.update((list) => list.filter((t) => t.id !== id));
  }
}
