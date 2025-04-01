import { Component } from '@angular/core';
import { MigrationService } from '../../core/services/migration.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private readonly _migrationService: MigrationService){}

  lancerMigration() {
    this._migrationService.migrateData().then(() => {
      console.log('Migration effectuée avec succès.');
    }).catch((error) => {
      console.error('Erreur lors de la migration:', error);
    });
  }
}
