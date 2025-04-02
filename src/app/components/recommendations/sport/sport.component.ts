import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { SportRecommendation } from '../../../core/interfaces';
import { OpenAiService } from '../../../core/services/openia.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css'
})
export class SportComponent implements OnInit {
  userId: string | null = null;
  recommendation: SportRecommendation | null = null;
  isLoading = true;

  constructor(
    private firestore: Firestore, 
    private _authService: AuthService,
    private _openAiService: OpenAiService ) {}

  async ngOnInit(): Promise<void> {
  const user = await firstValueFrom(this._authService.user$);
    if (user?.uid) {
      this.userId = user.uid;
      await this.loadRecommendation();
    }
  }

 
  async loadRecommendation() {
    try {
      const recommandation = await this._openAiService.getLastRecommendation<SportRecommendation>(this.userId!, 'sport');
      this.recommendation = recommandation;
    } catch (e) {
      console.error('Erreur lors du chargement de la recommandation soins :', e);
    } finally {
      this.isLoading = false;
    }
  }
}

