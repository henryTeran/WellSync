import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAiService } from '../../../core/services/openia.service';
import { SoinsRecommendation } from '../../../core/interfaces';

@Component({
  selector: 'app-soins',
  templateUrl: './soins.component.html',
  styleUrls: ['./soins.component.css']
})
export class SoinsComponent implements OnInit {
  recommendation: SoinsRecommendation | null = null;
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
      const recommandation = await this.openAiService.getLastRecommendation<SoinsRecommendation>(this.userId!, 'soins');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation soins :', e);
    } finally {
      this.isLoading = false;
    }
  }
}
