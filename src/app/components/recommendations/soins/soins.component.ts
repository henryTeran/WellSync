import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { SoinsRecommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';
import { Browser } from "@capacitor/browser"
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-soins',
  imports: [IonicModule],
  templateUrl: './soins.component.html',
  styleUrls: ['./soins.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SoinsComponent implements OnInit {
  recommendation: SoinsRecommendation | null = null;
  userId: string | null = null;
  isLoading = true;

  constructor(
    private _authService: AuthService,
    private _openAiService: OpenAiService
  ) {}

  async ngOnInit(): Promise<void> {
  const user = await firstValueFrom(this._authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
      await this.loadRecommendation();
    }
  }

  async loadRecommendation() {
    try {
      const recommandation = await this._openAiService.getLastRecommendation<SoinsRecommendation>(this.userId!, 'soins');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation soins :', e);
    } finally {
      this.isLoading = false;
    }
  }

  async openMap(institut: string) {
    const query = encodeURIComponent(institut);
    await Browser.open({ url: `https://www.google.com/maps/search/?api=1&query=${query}` });
  }
}
