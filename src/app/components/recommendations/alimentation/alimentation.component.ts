import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { AlimentationRecommendation } from '../../../core/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-alimentation',
  templateUrl: './alimentation.component.html',
  styleUrls: ['./alimentation.component.css']
})
export class AlimentationComponent implements OnInit {
  recommendation: AlimentationRecommendation | null = null;
  userId: string | null = null;
  isLoading = true;

  constructor(
    private readonly _authService: AuthService,
    private readonly _openAiService: OpenAiService
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
      const recommandation = await this._openAiService.getLastRecommendation<AlimentationRecommendation>(this.userId!, 'alimentation');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation alimentation :', e);
    } finally {
      this.isLoading = false;
    }
  }
}
