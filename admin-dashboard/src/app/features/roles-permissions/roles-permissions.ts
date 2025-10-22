import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaticDataService, Permission, Role, User } from '../../services/static-data.service';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-permissions.html',
  styleUrl: './roles-permissions.scss'
})
export class RolesPermissions {
  // Data accessed via this.data signals

  // UI state
  isCreatingUser = signal(false);
  editingUserId = signal<number | null>(null);
  isCreatingRole = signal(false);
  editingRoleId = signal<number | null>(null);

  // Forms
  userForm: FormGroup;
  roleForm: FormGroup;

  // Checkbox selections
  userExtraPermissionSet = signal<Set<string>>(new Set());
  rolePermissionSet = signal<Set<string>>(new Set());

  constructor(private fb: FormBuilder, public data: StaticDataService) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(120),
        ],
      ],
      roleId: [null],
    });

    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    });
  }

  // Helpers
  trackById = (_: number, item: { id: number }) => item.id;

  labelForPermissionId(id: string): string {
    const list = this.data.permissions();
    const found = list.find((p) => p.id === id);
    return found?.label ?? id;
  }

  // Permission checkbox helpers
  isUserExtraPermChecked(id: string) {
    return this.userExtraPermissionSet().has(id);
  }
  toggleUserExtraPerm(id: string) {
    const set = new Set(this.userExtraPermissionSet());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.userExtraPermissionSet.set(set);
  }

  isRolePermChecked(id: string) {
    return this.rolePermissionSet().has(id);
  }
  toggleRolePerm(id: string) {
    const set = new Set(this.rolePermissionSet());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.rolePermissionSet.set(set);
  }

  // Users CRUD
  startCreateUser() {
    this.isCreatingUser.set(true);
    this.editingUserId.set(null);
    this.userForm.reset({ roleId: null });
    this.userExtraPermissionSet.set(new Set());
  }

  startEditUser(user: User) {
    this.isCreatingUser.set(false);
    this.editingUserId.set(user.id);
    this.userForm.setValue({
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
    });
    this.userExtraPermissionSet.set(new Set(user.extraPermissionIds));
  }

  cancelUser() {
    this.isCreatingUser.set(false);
    this.editingUserId.set(null);
    this.userForm.reset({ roleId: null });
    this.userExtraPermissionSet.set(new Set());
  }

  saveUser() {
    if (this.userForm.invalid) return;
    const value = this.userForm.value as { fullName: string; email: string; roleId: number | null };
    const extraPermissionIds = Array.from(this.userExtraPermissionSet());

    if (this.editingUserId()) {
      this.data.updateUser(this.editingUserId()!, {
        fullName: value.fullName,
        email: value.email,
        roleId: value.roleId,
        extraPermissionIds,
      });
    } else {
      this.data.addUser({
        fullName: value.fullName,
        email: value.email,
        roleId: value.roleId,
        extraPermissionIds,
      });
    }

    this.cancelUser();
  }

  deleteUser(user: User) {
    if (!confirm(`Supprimer l'utilisateur "${user.fullName}" ?`)) return;
    this.data.deleteUser(user.id);
    if (this.editingUserId() === user.id) this.cancelUser();
  }

  // Roles CRUD
  startCreateRole() {
    this.isCreatingRole.set(true);
    this.editingRoleId.set(null);
    this.roleForm.reset();
    this.rolePermissionSet.set(new Set());
  }

  startEditRole(role: Role) {
    this.isCreatingRole.set(false);
    this.editingRoleId.set(role.id);
    this.roleForm.setValue({ name: role.name });
    this.rolePermissionSet.set(new Set(role.permissionIds));
  }

  cancelRole() {
    this.isCreatingRole.set(false);
    this.editingRoleId.set(null);
    this.roleForm.reset();
    this.rolePermissionSet.set(new Set());
  }

  saveRole() {
    if (this.roleForm.invalid) return;
    const value = this.roleForm.value as { name: string };
    const permissionIds = Array.from(this.rolePermissionSet());

    if (this.editingRoleId()) {
      this.data.updateRole(this.editingRoleId()!, { name: value.name, permissionIds });
    } else {
      this.data.addRole({ name: value.name, permissionIds });
    }

    this.cancelRole();
  }

  deleteRole(role: Role) {
    if (!confirm(`Supprimer le rôle "${role.name}" ?`)) return;
    this.data.deleteRole(role.id);
    if (this.editingRoleId() === role.id) this.cancelRole();
  }
}
