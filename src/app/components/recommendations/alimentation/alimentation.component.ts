import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { AlimentationRecommendation } from '../../../core/interfaces';

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
    private authService: AuthService,
    private openAiService: OpenAiService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userId = user?.uid || null;
      if (this.userId) {
        this.loadRecommendation();
      }
    });
  }

  async loadRecommendation() {
    try {
      const recommandation = await this.openAiService.getLastRecommendation<AlimentationRecommendation>(this.userId!, 'alimentation');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation alimentation :', e);
    } finally {
      this.isLoading = false;
    }
  }
}
