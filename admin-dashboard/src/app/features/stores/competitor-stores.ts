import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StaticDataService, Store } from '../../services/static-data.service';

@Component({
  selector: 'app-competitor-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competitor-stores.html',
  styleUrl: './competitor-stores.scss'
})
export class CompetitorStores implements OnInit, OnDestroy {

  creating = false;
  editingId: number | null = null;

  form: FormGroup;

  @ViewChild('map') mapRef?: ElementRef<HTMLDivElement>;
  private mapInstance?: any;
  private markerInstance?: any;

  constructor(private fb: FormBuilder, public data: StaticDataService, private zone: NgZone) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      brand: ['', [Validators.required, Validators.maxLength(80)]],
      latitude: [48.8566, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [2.3522, [Validators.required, Validators.min(-180), Validators.max(180)]],
      address: ['', [Validators.maxLength(200)]],
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    // Leaflet cleanup if needed
    if ((window as any).L && this.mapInstance) {
      this.mapInstance.remove();
    }
  }

  initMapIfNeeded() {
    const L = (window as any).L;
    if (!L || !this.mapRef) return;
    if (!this.mapInstance) {
      this.mapInstance = L.map(this.mapRef.nativeElement).setView([this.form.value.latitude, this.form.value.longitude], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.mapInstance);
      this.markerInstance = L.marker([this.form.value.latitude, this.form.value.longitude], { draggable: true }).addTo(this.mapInstance);
      this.markerInstance.on('dragend', () => {
        const { lat, lng } = this.markerInstance.getLatLng();
        this.zone.run(() => {
          this.form.patchValue({ latitude: lat, longitude: lng });
        });
      });
      this.mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.markerInstance.setLatLng([lat, lng]);
        this.zone.run(() => {
          this.form.patchValue({ latitude: lat, longitude: lng });
        });
      });
    } else {
      this.mapInstance.setView([this.form.value.latitude, this.form.value.longitude], 6);
      this.markerInstance.setLatLng([this.form.value.latitude, this.form.value.longitude]);
    }
  }

  startCreate() {
    this.creating = true;
    this.editingId = null;
    this.form.reset({ name: '', brand: '', latitude: 48.8566, longitude: 2.3522, address: '' });
    setTimeout(() => this.initMapIfNeeded());
  }

  startEdit(store: Store) {
    this.creating = false;
    this.editingId = store.id;
    this.form.setValue({
      name: store.name,
      brand: store.brand,
      latitude: store.latitude,
      longitude: store.longitude,
      address: store.address ?? '',
    });
    setTimeout(() => this.initMapIfNeeded());
  }

  cancel() {
    this.creating = false;
    this.editingId = null;
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as Omit<Store, 'id'>;
    if (this.editingId) this.data.updateStore(this.editingId, v);
    else this.data.addStore(v);
    this.cancel();
  }

  delete(store: Store) {
    if (!confirm(`Supprimer "${store.name}" ?`)) return;
    this.data.deleteStore(store.id);
    if (this.editingId === store.id) this.cancel();
  }
}
