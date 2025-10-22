import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StaticDataService, TourMission } from '../../services/static-data.service';

@Component({
  selector: 'app-tour-planning',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour-planning.html',
  styleUrl: './tour-planning.scss'
})
export class TourPlanning {

  creating = false;
  editingId: number | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, public data: StaticDataService) {
    this.form = this.fb.group({
      collaboratorName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      storeId: [null, [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      missionType: ['', [Validators.required, Validators.maxLength(60)]],
      department: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  storeName(storeId: number): string | number {
    const s = this.data.stores().find((x) => x.id === storeId);
    return s?.name ?? storeId;
  }

  startCreate() {
    this.creating = true;
    this.editingId = null;
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    this.form.reset({
      collaboratorName: '',
      storeId: null,
      startDate: today,
      endDate: tomorrow,
      missionType: '',
      department: '',
    });
  }

  startEdit(t: TourMission) {
    this.creating = false;
    this.editingId = t.id;
    this.form.setValue({
      collaboratorName: t.collaboratorName,
      storeId: t.storeId,
      startDate: t.startDate,
      endDate: t.endDate,
      missionType: t.missionType,
      department: t.department,
    });
  }

  cancel() {
    this.creating = false;
    this.editingId = null;
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as Omit<TourMission, 'id'>;
    if (this.editingId) this.data.updateTour(this.editingId, v);
    else this.data.addTour(v);
    this.cancel();
  }

  delete(t: TourMission) {
    if (!confirm(`Supprimer la tournée de ${t.collaboratorName} ?`)) return;
    this.data.deleteTour(t.id);
    if (this.editingId === t.id) this.cancel();
  }
}
